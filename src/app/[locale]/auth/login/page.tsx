'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Input, Label } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

function normalizeIndianPhone(input: string) {
  const digits = input.replace(/\D/g, '');
  if (digits.length === 12 && digits.startsWith('91')) return digits.slice(2);
  return digits;
}

export default function LoginPage({ params: { locale } }: { params: { locale: string } }) {
  const t = useTranslations('auth');
  const router = useRouter();
  const params = useSearchParams();
  const nextUrl = params.get('next') ?? '/dashboard';
  const [mode, setMode] = useState<'otp' | 'admin'>('otp');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const sendOtp = async () => {
    const normalizedPhone = normalizeIndianPhone(phone);
    if (!/^[6-9]\d{9}$/.test(normalizedPhone)) return toast.error('Enter a valid mobile number');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/otp/send', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: normalizedPhone, purpose: 'login' }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      if (data.devOtp) {
        toast.success(`OTP sent (dev): ${data.devOtp}`);
      } else {
        toast.success('OTP sent');
      }
      setPhone(normalizedPhone);
      setOtpSent(true);
    } catch (e: any) { toast.error(e.message); } finally { setLoading(false); }
  };

  const verifyOtp = async () => {
    const normalizedPhone = normalizeIndianPhone(phone);
    setLoading(true);
    const res = await signIn('phone-otp', { phone: normalizedPhone, otp, redirect: false });
    setLoading(false);
    if (res?.error) return toast.error('Invalid OTP');
    router.push(`/${locale}${nextUrl}`);
  };

  const adminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await signIn('admin-credentials', { email, password, redirect: false });
    setLoading(false);
    if (res?.error) return toast.error('Invalid credentials');
    router.push(`/${locale}/admin`);
  };

  return (
    <section className="section min-h-[calc(100vh-4rem)] grid place-items-center bg-brand-gray">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">{t('loginTitle')}</CardTitle>
          <CardDescription>{t('loginSubtitle')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4 p-1 bg-brand-gray rounded-md">
            <button onClick={() => setMode('otp')} className={`flex-1 py-2 rounded text-sm font-semibold ${mode === 'otp' ? 'bg-white text-brand-blue shadow' : 'text-muted-foreground'}`}>Citizen / Member</button>
            <button onClick={() => setMode('admin')} className={`flex-1 py-2 rounded text-sm font-semibold ${mode === 'admin' ? 'bg-white text-brand-blue shadow' : 'text-muted-foreground'}`}>{t('adminLogin')}</button>
          </div>

          {mode === 'otp' && (
            <div className="space-y-4">
              <div>
                <Label>{t('phoneLabel')}</Label>
                <Input inputMode="tel" placeholder="+91 9986453663" value={phone} onChange={(e) => setPhone(e.target.value)} disabled={otpSent} />
              </div>
              {otpSent && (
                <div>
                  <Label>{t('otpLabel')}</Label>
                  <Input inputMode="numeric" maxLength={6} value={otp} onChange={(e) => setOtp(e.target.value)} className="tracking-[0.5em] text-center text-xl" />
                </div>
              )}
              {!otpSent
                ? <Button className="w-full" size="lg" onClick={sendOtp} disabled={loading}>{t('sendOtp')}</Button>
                : <Button className="w-full" size="lg" variant="accent" onClick={verifyOtp} disabled={loading || otp.length !== 6}>{t('verify')}</Button>}
              <p className="text-center text-sm">No account? <Link href={`/${locale}/membership/join`} className="text-brand-blue font-semibold hover:underline">Join now</Link></p>
            </div>
          )}

          {mode === 'admin' && (
            <form onSubmit={adminLogin} className="space-y-4">
              <div><Label>{t('emailLabel')}</Label><Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></div>
              <div><Label>{t('passwordLabel')}</Label><Input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} /></div>
              <Button className="w-full" size="lg" type="submit" disabled={loading}>Login</Button>
            </form>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
