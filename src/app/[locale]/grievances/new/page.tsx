'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input, Textarea, Label } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { KARNATAKA_DISTRICTS } from '@/lib/karnataka';

const CATEGORIES = [
  'ROADS', 'WATER', 'ELECTRICITY', 'EDUCATION', 'HEALTH',
  'GOVERNMENT_BENEFITS', 'SOCIAL_WELFARE', 'AGRICULTURE', 'EMPLOYMENT', 'OTHER',
] as const;

export default function NewGrievancePage({ params: { locale } }: { params: { locale: string } }) {
  const router = useRouter();
  const { status } = useSession();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    category: 'ROADS' as (typeof CATEGORIES)[number],
    subject: '', description: '', location: '',
    district: '', taluk: '', pincode: '',
  });

  if (status === 'unauthenticated') {
    if (typeof window !== 'undefined') router.replace(`/${locale}/auth/login?next=/grievances/new`);
    return null;
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/grievances', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed');
      toast.success(`Submitted! Ticket: ${data.ticketId}`);
      router.push(`/${locale}/dashboard`);
    } catch (e: any) { toast.error(e.message); } finally { setLoading(false); }
  };

  return (
    <section className="section bg-brand-gray min-h-[calc(100vh-4rem)]">
      <div className="container-page max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Submit a Grievance</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={submit} className="space-y-4">
              <div>
                <Label>Category *</Label>
                <select className="flex h-11 w-full rounded-md border bg-white px-3" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as any })}>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c.replace('_', ' ')}</option>)}
                </select>
              </div>
              <div>
                <Label>Subject *</Label>
                <Input required minLength={5} maxLength={200} value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
              </div>
              <div>
                <Label>Description *</Label>
                <Textarea required minLength={20} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={5} />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label>District *</Label>
                  <select className="flex h-11 w-full rounded-md border bg-white px-3" value={form.district} onChange={(e) => setForm({ ...form, district: e.target.value, taluk: '' })}>
                    <option value="">Select</option>
                    {Object.keys(KARNATAKA_DISTRICTS).map((d) => <option key={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <Label>Taluk *</Label>
                  <select className="flex h-11 w-full rounded-md border bg-white px-3" value={form.taluk} onChange={(e) => setForm({ ...form, taluk: e.target.value })} disabled={!form.district}>
                    <option value="">Select</option>
                    {(KARNATAKA_DISTRICTS[form.district] ?? []).map((t) => <option key={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label>Location *</Label>
                  <Input required value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Village / Locality" />
                </div>
                <div>
                  <Label>Pincode</Label>
                  <Input inputMode="numeric" maxLength={6} value={form.pincode} onChange={(e) => setForm({ ...form, pincode: e.target.value })} />
                </div>
              </div>
              <Button type="submit" size="lg" className="w-full" disabled={loading}>{loading ? 'Submitting…' : 'Submit Grievance'}</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
