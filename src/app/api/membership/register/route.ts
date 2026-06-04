import { NextResponse } from 'next/server';
import QRCode from 'qrcode';
import { prisma } from '@/lib/prisma';
import { signupSchema } from '@/lib/validators';
import { verifyOtp } from '@/lib/otp';
import { generateMembershipId } from '@/lib/utils';
import { apiRateLimiter } from '@/lib/rate-limit';

export async function POST(req: Request) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] ?? 'anon';
    const { success } = await apiRateLimiter.limit(`signup:${ip}`);
    if (!success) return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });

    const data = signupSchema.parse(await req.json());

    const validOtp = await verifyOtp(data.phone, data.otp, 'signup');
    if (!validOtp) return NextResponse.json({ error: 'Invalid or expired OTP' }, { status: 400 });

    const existing = await prisma.user.findUnique({
      where: { phone: data.phone },
      include: { membership: true },
    });
    if (existing?.membership) {
      return NextResponse.json({ error: 'Phone already registered' }, { status: 409 });
    }

    const membershipId = generateMembershipId();
    const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify/${membershipId}`;
    const qrCode = await QRCode.toDataURL(verifyUrl, { width: 320, margin: 1 });

    const user = await prisma.user.upsert({
      where: { phone: data.phone },
      update: {
        name: data.name,
        nameKannada: data.nameKannada || null,
        email: data.email || null,
        district: data.district,
        taluk: data.taluk,
        phoneVerified: new Date(),
        role: data.membershipType === 'VOLUNTEER' ? 'VOLUNTEER' : data.membershipType === 'TEACHER_REPRESENTATIVE' ? 'TEACHER' : 'MEMBER',
      },
      create: {
        phone: data.phone,
        name: data.name,
        nameKannada: data.nameKannada || null,
        email: data.email || null,
        district: data.district,
        taluk: data.taluk,
        phoneVerified: new Date(),
        role: data.membershipType === 'VOLUNTEER' ? 'VOLUNTEER' : data.membershipType === 'TEACHER_REPRESENTATIVE' ? 'TEACHER' : 'MEMBER',
      },
    });

    const membership = await prisma.membership.create({
      data: {
        userId: user.id,
        membershipId,
        type: data.membershipType,
        status: 'ACTIVE',
        qrCode,
        validTo: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'membership.created',
        resource: 'Membership',
        resourceId: membership.id,
        ipAddress: ip,
      },
    });

    return NextResponse.json({
      ok: true,
      membershipId: membership.membershipId,
      userId: user.id,
      card: {
        name: user.name,
        membershipId: membership.membershipId,
        type: membership.type,
        qrCode: membership.qrCode,
        joinedAt: membership.joinedAt,
        validTo: membership.validTo,
      },
    });
  } catch (err: any) {
    if (err.issues) return NextResponse.json({ error: err.issues[0].message }, { status: 400 });
    if (err?.code === 'P2002') return NextResponse.json({ error: 'Phone already registered' }, { status: 409 });
    console.error(err);
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
  }
}
