import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createOtp } from '@/lib/otp';
import { phoneSchema } from '@/lib/validators';
import { otpRateLimiter } from '@/lib/rate-limit';

const bodySchema = z.object({
  phone: phoneSchema,
  purpose: z.enum(['signup', 'login', 'password_reset']),
});

export async function POST(req: Request) {
  try {
    const data = bodySchema.parse(await req.json());
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] ?? 'anon';
    const { success } = await otpRateLimiter.limit(`${data.phone}:${ip}`);
    if (!success) {
      return NextResponse.json({ error: 'Too many requests. Try again in a minute.' }, { status: 429 });
    }
    
    try {
      const otp = await createOtp(data.phone, data.purpose);
      const isSmsConfigured = Boolean(process.env.MSG91_AUTH_KEY);
      if (process.env.NODE_ENV !== 'production' && !isSmsConfigured) {
        return NextResponse.json({ ok: true, devOtp: otp, via: 'console' });
      }
      return NextResponse.json({ ok: true, via: 'sms' });
    } catch (smsErr: any) {
      console.error('OTP creation/SMS error:', smsErr);
      return NextResponse.json({ error: 'Failed to send OTP. Please try again.' }, { status: 500 });
    }
  } catch (err: any) {
    if (err.issues) return NextResponse.json({ error: err.issues[0].message }, { status: 400 });
    console.error(err);
    return NextResponse.json({ error: 'Failed to send OTP' }, { status: 500 });
  }
}
