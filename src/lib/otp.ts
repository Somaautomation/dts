import bcrypt from 'bcryptjs';
import { prisma } from './prisma';

const OTP_TTL_MS = 5 * 60 * 1000; // 5 minutes

export function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function createOtp(phone: string, purpose: string): Promise<string> {
  const code = process.env.NODE_ENV !== 'production' && process.env.OTP_BYPASS_CODE
    ? process.env.OTP_BYPASS_CODE
    : generateOtp();
  const codeHash = await bcrypt.hash(code, 10);

  // Invalidate previous unused OTPs
  await prisma.otpRequest.updateMany({
    where: { phone, purpose, consumed: false },
    data: { consumed: true },
  });

  await prisma.otpRequest.create({
    data: {
      phone,
      codeHash,
      purpose,
      expiresAt: new Date(Date.now() + OTP_TTL_MS),
    },
  });

  await sendSms(phone, `Your D.T. Srinivas Connect verification code is: ${code}. Valid for 5 minutes.`);
  return code; // returned for dev / testing flows; in prod the API hides this
}

export async function verifyOtp(phone: string, code: string, purpose: string): Promise<boolean> {
  const otp = await prisma.otpRequest.findFirst({
    where: { phone, purpose, consumed: false, expiresAt: { gt: new Date() } },
    orderBy: { createdAt: 'desc' },
  });
  if (!otp) return false;
  if (otp.attempts >= 5) return false;

  const valid = await bcrypt.compare(code, otp.codeHash);
  await prisma.otpRequest.update({
    where: { id: otp.id },
    data: { attempts: { increment: 1 }, consumed: valid },
  });
  return valid;
}

async function sendSms(phone: string, message: string): Promise<void> {
  const key = process.env.MSG91_AUTH_KEY;
  if (!key) {
    console.log(`[SMS DEV] to=${phone} msg=${message}`);
    return;
  }
  try {
    await fetch('https://control.msg91.com/api/v5/flow/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', authkey: key },
      body: JSON.stringify({
        template_id: process.env.MSG91_TEMPLATE_ID,
        sender: process.env.MSG91_SENDER_ID,
        short_url: '0',
        recipients: [{ mobiles: `91${phone}`, message }],
      }),
    });
  } catch (err) {
    console.error('SMS send failed', err);
  }
}
