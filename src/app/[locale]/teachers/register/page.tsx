'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input, Label } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { KARNATAKA_DISTRICTS } from '@/lib/karnataka';

const CATEGORIES = ['PRIMARY','HIGH_SCHOOL','PU_COLLEGE','DEGREE_COLLEGE','PRIVATE_AIDED','PRIVATE_UNAIDED','GOVERNMENT','RETIRED'] as const;

export default function TeacherRegister({ params: { locale } }: { params: { locale: string } }) {
  const router = useRouter();
  const { status } = useSession();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    teacherId: '', category: 'HIGH_SCHOOL' as (typeof CATEGORIES)[number],
    institution: '', designation: '', subject: '',
    yearsOfService: 0, district: '', taluk: '',
  });

  if (status === 'unauthenticated') {
    if (typeof window !== 'undefined') router.replace(`/${locale}/auth/login?next=/teachers/register`);
    return null;
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/teachers', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed');
      toast.success('Teacher profile created');
      router.push(`/${locale}/teachers`);
    } catch (e: any) { toast.error(e.message); } finally { setLoading(false); }
  };

  return (
    <section className="section bg-brand-gray min-h-[calc(100vh-4rem)]">
      <div className="container-page max-w-2xl">
        <Card>
          <CardHeader><CardTitle className="text-2xl">Teacher Profile Registration</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={submit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div><Label>Teacher / KARTET ID *</Label><Input required value={form.teacherId} onChange={(e) => setForm({ ...form, teacherId: e.target.value })} /></div>
                <div>
                  <Label>Category *</Label>
                  <select className="flex h-11 w-full rounded-md border bg-white px-3" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as any })}>
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c.replace('_', ' ')}</option>)}
                  </select>
                </div>
              </div>
              <div><Label>Institution *</Label><Input required value={form.institution} onChange={(e) => setForm({ ...form, institution: e.target.value })} /></div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div><Label>Designation *</Label><Input required value={form.designation} onChange={(e) => setForm({ ...form, designation: e.target.value })} /></div>
                <div><Label>Subject</Label><Input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} /></div>
              </div>
              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <Label>District *</Label>
                  <select className="flex h-11 w-full rounded-md border bg-white px-3" value={form.district} onChange={(e) => setForm({ ...form, district: e.target.value, taluk: '' })}>
                    <option value="">Select</option>
                    {Object.keys(KARNATAKA_DISTRICTS).map((d) => <option key={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <Label>Taluk *</Label>
                  <select className="flex h-11 w-full rounded-md border bg-white px-3" disabled={!form.district} value={form.taluk} onChange={(e) => setForm({ ...form, taluk: e.target.value })}>
                    <option value="">Select</option>
                    {(KARNATAKA_DISTRICTS[form.district] ?? []).map((t) => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div><Label>Years of Service *</Label><Input type="number" min={0} max={60} required value={form.yearsOfService} onChange={(e) => setForm({ ...form, yearsOfService: Number(e.target.value) })} /></div>
              </div>
              <Button type="submit" size="lg" className="w-full" disabled={loading}>{loading ? 'Saving…' : 'Create Profile'}</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
