'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { signIn } from 'next-auth/react';
import { toast } from 'sonner';
import { CheckCircle2 } from 'lucide-react';
import { useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

import { Button } from '@/components/ui/button';
import { Input, Label } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { KARNATAKA_DISTRICTS } from '@/lib/karnataka';

function normalizeIndianPhone(input: string) {
  const digits = input.replace(/\D/g, '');
  if (digits.length === 12 && digits.startsWith('91')) return digits.slice(2);
  return digits;
}

const MEMBERSHIP_TYPES = [
  { value: 'SUPPORTER', label: 'Supporter' },
  { value: 'VOLUNTEER', label: 'Volunteer' },
  { value: 'TEACHER_REPRESENTATIVE', label: 'Teacher Representative' },
  { value: 'YOUTH_MEMBER', label: 'Youth Member' },
  { value: 'WOMENS_WING', label: "Women's Wing Member" },
  { value: 'COMMUNITY_LEADER', label: 'Community Leader' },
] as const;

type Step = 1 | 2 | 3 | 4 | 5 | 6;

export default function JoinMembershipPage({ params: { locale } }: { params: { locale: string } }) {
  const router = useRouter();
  const t = useTranslations('membership');
  const [step, setStep] = useState<Step>(1);
  const [loading, setLoading] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const [form, setForm] = useState({
    phone: '',
    otp: '',
    name: '',
    nameKannada: '',
    email: '',
    district: '',
    taluk: '',
    membershipType: 'SUPPORTER' as (typeof MEMBERSHIP_TYPES)[number]['value'],
  });
  const [card, setCard] = useState<null | {
    name: string;
    membershipId: string;
    type: string;
    qrCode?: string | null;
    joinedAt: string;
    validTo: string | null;
  }>(null);

  const update = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const requestOtp = async () => {
    const normalizedPhone = normalizeIndianPhone(form.phone);
    if (!/^[6-9]\d{9}$/.test(normalizedPhone)) return toast.error('Enter a valid 10-digit mobile number');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: normalizedPhone, purpose: 'signup' }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed');
      if (data.devOtp) {
        toast.success(`OTP sent (dev): ${data.devOtp}`);
      } else {
        toast.success('OTP sent');
      }
      setForm((prev) => ({ ...prev, phone: normalizedPhone }));
      setStep(2);
    } catch (e: any) { toast.error(e.message); } finally { setLoading(false); }
  };

  const verifyAndContinue = async () => {
    if (!/^\d{6}$/.test(form.otp)) return toast.error('OTP must be 6 digits');
    setStep(3);
  };

  const submit = async () => {
    setLoading(true);
    try {
      const normalizedPhone = normalizeIndianPhone(form.phone);
      const res = await fetch('/api/membership/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, phone: normalizedPhone }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Registration failed');
      setCard(data.card);
      toast.success('Welcome to the movement!');
      await signIn('phone-otp', { phone: normalizedPhone, otp: form.otp, redirect: false });
      setStep(6);
    } catch (e: any) { toast.error(e.message); } finally { setLoading(false); }
  };

  const downloadCardPdf = async () => {
    if (!cardRef.current || !card?.membershipId) return;
    const canvas = await html2canvas(cardRef.current, { scale: 3, backgroundColor: null });
    const img = canvas.toDataURL('image/png');
    const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: [85.6, 54] });
    pdf.addImage(img, 'PNG', 0, 0, 85.6, 54);
    pdf.save(`DTSC-Membership-${card.membershipId}.pdf`);
  };

  const steps = [
    '1 Mobile Number',
    '2 OTP Verification',
    '3 Profile',
    '4 Your Location',
    '5 Membership Type',
    '6 Confirmation',
  ];

  return (
    <section className="section bg-brand-gray min-h-[calc(100vh-4rem)]">
      <div className="container-page max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-brand-blue">Join the Supporters Network</h1>
          <p className="text-muted-foreground mt-2">Become part of a movement for education, empowerment and equality</p>
          <ol className="mt-5 grid sm:grid-cols-2 gap-2 text-sm text-brand-blue/90 text-left mx-auto max-w-xl">
            {steps.map((label) => (
              <li key={label} className="rounded-md bg-brand-blue/5 px-3 py-2 border border-brand-blue/15">{label}</li>
            ))}
          </ol>
        </div>

        <Stepper current={step} labels={steps} />

        <Card className="mt-6">
          <CardContent className="p-6 md:p-8">
            {step === 1 && (
              <div className="space-y-4">
                <CardTitle>Mobile Number</CardTitle>
                <div>
                  <Label htmlFor="phone">Mobile Number</Label>
                  <Input id="phone" inputMode="tel" placeholder="+91 9986453663" value={form.phone} onChange={update('phone')} />
                </div>
                <Button className="w-full" size="lg" disabled={loading} onClick={requestOtp}>Send OTP</Button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <CardTitle>{t('steps.otp')}</CardTitle>
                <CardDescription>Enter the 6-digit code sent to +91 {form.phone}</CardDescription>
                <Input inputMode="numeric" maxLength={6} placeholder="123456" value={form.otp} onChange={update('otp')} className="text-center text-2xl tracking-[1em]" />
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
                  <Button className="flex-1" onClick={verifyAndContinue}>Continue</Button>
                </div>
                <button onClick={requestOtp} className="text-sm text-brand-blue hover:underline">Resend OTP</button>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <CardTitle>{t('steps.profile')}</CardTitle>
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input id="name" value={form.name} onChange={update('name')} required />
                </div>
                <div>
                  <Label htmlFor="nameKn">ಪೂರ್ಣ ಹೆಸರು (ಕನ್ನಡ)</Label>
                  <Input id="nameKn" value={form.nameKannada} onChange={update('nameKannada')} />
                </div>
                <div>
                  <Label htmlFor="email">Email (optional)</Label>
                  <Input id="email" type="email" value={form.email} onChange={update('email')} />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setStep(2)}>Back</Button>
                  <Button className="flex-1" disabled={!form.name} onClick={() => setStep(4)}>Continue</Button>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-4">
                <CardTitle>{t('steps.location')}</CardTitle>
                <div>
                  <Label>District *</Label>
                  <select className="flex h-11 w-full rounded-md border bg-white px-3 text-sm" value={form.district} onChange={update('district')}>
                    <option value="">Select District</option>
                    {Object.keys(KARNATAKA_DISTRICTS).map((d) => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <Label>Taluk *</Label>
                  <select className="flex h-11 w-full rounded-md border bg-white px-3 text-sm" value={form.taluk} onChange={update('taluk')} disabled={!form.district}>
                    <option value="">Select Taluk</option>
                    {(KARNATAKA_DISTRICTS[form.district] ?? []).map((tk) => <option key={tk} value={tk}>{tk}</option>)}
                  </select>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setStep(3)}>Back</Button>
                  <Button className="flex-1" disabled={!form.district || !form.taluk} onClick={() => setStep(5)}>Continue</Button>
                </div>
              </div>
            )}

            {step === 5 && (
              <div className="space-y-4">
                <CardTitle>{t('steps.type')}</CardTitle>
                <div className="grid sm:grid-cols-2 gap-3">
                  {MEMBERSHIP_TYPES.map((mt) => (
                    <label key={mt.value} className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${form.membershipType === mt.value ? 'border-brand-blue bg-brand-blue/5' : 'border-gray-200 hover:border-brand-blue/40'}`}>
                      <input type="radio" name="mt" value={mt.value} checked={form.membershipType === mt.value} onChange={update('membershipType') as any} className="sr-only" />
                      <div className="font-semibold text-brand-blue">{mt.label}</div>
                    </label>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setStep(4)}>Back</Button>
                  <Button className="flex-1" variant="accent" disabled={loading} onClick={submit}>{loading ? 'Submitting…' : 'Complete Registration'}</Button>
                </div>
              </div>
            )}

            {step === 6 && card && (
              <div className="text-center space-y-4 py-6">
                <CheckCircle2 className="h-16 w-16 text-brand-green mx-auto" />
                <CardTitle className="text-2xl">Welcome to the movement!</CardTitle>
                <CardDescription>Your Digital Membership Card is ready.</CardDescription>

                <div className="flex justify-center pt-2">
                  <div
                    ref={cardRef}
                    className="w-[400px] h-[250px] rounded-xl overflow-hidden shadow-2xl text-white relative gradient-brand p-5 text-left"
                  >
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,153,51,0.3),transparent_60%)]" />
                    <div className="relative flex justify-between items-start">
                      <div>
                        <div className="text-[10px] uppercase tracking-widest text-white/80">D.T. Srinivas Connect</div>
                        <div className="text-sm font-semibold">Member Identity Card</div>
                      </div>
                      <div className="h-10 w-10 grid place-items-center rounded-full bg-white text-brand-blue font-bold">DT</div>
                    </div>
                    <div className="relative mt-6 flex justify-between items-end">
                      <div>
                        <div className="text-xs text-white/70">Name</div>
                        <div className="font-bold">{card.name}</div>
                        <div className="text-xs text-white/70 mt-2">Member ID</div>
                        <div className="font-mono font-bold">{card.membershipId}</div>
                        <div className="text-[10px] mt-1 text-white/70">{card.type.replace('_', ' ')}</div>
                      </div>
                      {card.qrCode && <img src={card.qrCode} alt="QR" className="h-20 w-20 bg-white rounded" />}
                    </div>
                    <div className="absolute bottom-2 left-5 right-5 flex justify-between text-[9px] text-white/70">
                      <span>Issued: {new Date(card.joinedAt).toLocaleDateString()}</span>
                      <span>Valid till: {card.validTo ? new Date(card.validTo).toLocaleDateString() : '—'}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 justify-center pt-4 flex-wrap">
                  <Button onClick={downloadCardPdf} variant="accent">Download Card (PDF)</Button>
                  <Button onClick={() => router.push(`/${locale}/membership/card`)} variant="outline">Open Card Page</Button>
                  <Button onClick={() => router.push(`/${locale}/dashboard`)} variant="outline">Dashboard</Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

function Stepper({ current, labels }: { current: number; labels: string[] }) {
  return (
    <ol className="flex items-center justify-between gap-2 max-w-2xl mx-auto overflow-x-auto">
      {labels.map((l, i) => {
        const step = i + 1;
        const done = step < current;
        const active = step === current;
        return (
          <li key={l} className="flex items-center gap-2 flex-1 min-w-0">
            <span className={`grid h-8 w-8 place-items-center rounded-full text-xs font-bold shrink-0 ${done ? 'bg-brand-green text-white' : active ? 'bg-brand-blue text-white' : 'bg-gray-200 text-gray-600'}`}>{done ? '✓' : step}</span>
            <span className={`text-xs hidden sm:inline truncate ${active ? 'text-brand-blue font-semibold' : 'text-muted-foreground'}`}>{l}</span>
            {step < labels.length && <span className={`h-0.5 flex-1 ${done ? 'bg-brand-green' : 'bg-gray-200'}`} />}
          </li>
        );
      })}
    </ol>
  );
}
