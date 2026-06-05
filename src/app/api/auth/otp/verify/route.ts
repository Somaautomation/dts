import { NextResponse } from 'next/server';
import { z } from 'zod';
import { checkOtpValidity } from '@/lib/otp';
import { phoneSchema, otpSchema } from '@/lib/validators';

const bodySchema = z.object({
  phone: phoneSchema,
  otp: otpSchema,
  purpose: z.enum(['signup', 'login', 'password_reset']),
});

export async function POST(req: Request) {
  try {
    const data = bodySchema.parse(await req.json());
    
    const isValid = await checkOtpValidity(data.phone, data.otp, data.purpose);
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid or expired OTP' }, { status: 400 });
    }

    return NextResponse.json({ ok: true, valid: true });
  } catch (err: any) {
    if (err.issues) return NextResponse.json({ error: err.issues[0].message }, { status: 400 });
    console.error(err);
    return NextResponse.json({ error: 'OTP verification failed' }, { status: 500 });
  }
}
