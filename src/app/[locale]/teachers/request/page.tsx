'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input, Label, Textarea } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const TYPES = ['GRIEVANCE','TRANSFER','PROMOTION','PENSION','POLICY_FEEDBACK','REPRESENTATION','OTHER'] as const;

export default function TeacherRequestPage({ params: { locale } }: { params: { locale: string } }) {
  const router = useRouter();
  const params = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    type: (params.get('type') as (typeof TYPES)[number]) ?? 'GRIEVANCE',
    subject: '', description: '',
  });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/teachers/requests', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
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
          <CardHeader><CardTitle className="text-2xl">File Teacher Request</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={submit} className="space-y-4">
              <div>
                <Label>Request Type *</Label>
                <select className="flex h-11 w-full rounded-md border bg-white px-3" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as any })}>
                  {TYPES.map((t) => <option key={t} value={t}>{t.replace('_', ' ')}</option>)}
                </select>
              </div>
              <div><Label>Subject *</Label><Input required minLength={5} value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} /></div>
              <div><Label>Description *</Label><Textarea required minLength={20} rows={6} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
              <Button type="submit" size="lg" className="w-full" disabled={loading}>{loading ? 'Submitting…' : 'Submit Request'}</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
