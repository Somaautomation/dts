import { NextResponse } from 'next/server';
import QRCode from 'qrcode';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { eventRegistrationSchema } from '@/lib/validators';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const userId = (session.user as any).id as string;
  try {
    const data = eventRegistrationSchema.parse(await req.json());
    const event = await prisma.event.findUnique({ where: { id: data.eventId } });
    if (!event || !event.registrationOpen) return NextResponse.json({ error: 'Registration closed' }, { status: 400 });

    const qr = await QRCode.toDataURL(`${process.env.NEXT_PUBLIC_APP_URL}/events/checkin/${data.eventId}/${userId}`, { width: 240 });
    const reg = await prisma.eventRegistration.upsert({
      where: { eventId_userId: { eventId: data.eventId, userId } },
      update: { qrCode: qr },
      create: { eventId: data.eventId, userId, qrCode: qr },
    });
    return NextResponse.json({ ok: true, registrationId: reg.id, qrCode: qr });
  } catch (err: any) {
    if (err.issues) return NextResponse.json({ error: err.issues[0].message }, { status: 400 });
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
