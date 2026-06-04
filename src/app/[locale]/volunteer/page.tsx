'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Input, Label, Textarea } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { KARNATAKA_DISTRICTS } from '@/lib/karnataka';

const SKILLS = ['social-media', 'field-work', 'translation', 'graphic-design', 'public-speaking', 'event-management', 'data-entry', 'photography', 'video', 'legal'];

export default function VolunteerPage({ params: { locale } }: { params: { locale: string } }) {
  const router = useRouter();
  const t = useTranslations('volunteer');
  const { status } = useSession();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    skills: [] as string[],
    availability: 'flexible' as 'weekends' | 'evenings' | 'full-time' | 'flexible',
    district: '', taluk: '', booth: '',
    experience: '', motivation: '',
  });

  const toggleSkill = (s: string) =>
    setForm((f) => ({ ...f, skills: f.skills.includes(s) ? f.skills.filter((x) => x !== s) : [...f.skills, s] }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status !== 'authenticated') {
      router.push(`/${locale}/auth/login?next=/volunteer`);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/volunteers', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed');
      toast.success('You are now a volunteer!');
      router.push(`/${locale}/dashboard`);
    } catch (e: any) { toast.error(e.message); } finally { setLoading(false); }
  };

  return (
    <>
      <section className="gradient-brand text-white py-16">
        <div className="container-page">
          <h1 className="text-4xl md:text-5xl font-bold">{t('title')}</h1>
          <p className="mt-3 text-white/85 max-w-2xl">{t('subtitle')}</p>
        </div>
      </section>

      <section className="section bg-brand-gray">
        <div className="container-page max-w-2xl">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">{t('join')}</CardTitle>
              <CardDescription>Help us mobilize change in every taluk of Karnataka.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={submit} className="space-y-5">
                <div>
                  <Label>{t('skills')} *</Label>
                  <div className="flex flex-wrap gap-2">
                    {SKILLS.map((s) => (
                      <button type="button" key={s} onClick={() => toggleSkill(s)}
                        className={`px-3 py-1.5 rounded-full text-sm border ${form.skills.includes(s) ? 'bg-brand-blue text-white border-brand-blue' : 'bg-white border-gray-300 hover:border-brand-blue'}`}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <Label>{t('availability')} *</Label>
                  <select className="flex h-11 w-full rounded-md border bg-white px-3"
                    value={form.availability} onChange={(e) => setForm({ ...form, availability: e.target.value as any })}>
                    <option value="flexible">Flexible</option>
                    <option value="weekends">Weekends</option>
                    <option value="evenings">Evenings</option>
                    <option value="full-time">Full Time</option>
                  </select>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label>District *</Label>
                    <select className="flex h-11 w-full rounded-md border bg-white px-3"
                      value={form.district} onChange={(e) => setForm({ ...form, district: e.target.value, taluk: '' })}>
                      <option value="">Select</option>
                      {Object.keys(KARNATAKA_DISTRICTS).map((d) => <option key={d}>{d}</option>)}
                    </select>
                  </div>
                  <div>
                    <Label>Taluk *</Label>
                    <select className="flex h-11 w-full rounded-md border bg-white px-3" disabled={!form.district}
                      value={form.taluk} onChange={(e) => setForm({ ...form, taluk: e.target.value })}>
                      <option value="">Select</option>
                      {(KARNATAKA_DISTRICTS[form.district] ?? []).map((t) => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <Label>Booth (optional)</Label>
                  <Input value={form.booth} onChange={(e) => setForm({ ...form, booth: e.target.value })} />
                </div>
                <div>
                  <Label>Experience</Label>
                  <Textarea rows={3} value={form.experience} onChange={(e) => setForm({ ...form, experience: e.target.value })} />
                </div>
                <div>
                  <Label>Why do you want to volunteer?</Label>
                  <Textarea rows={3} value={form.motivation} onChange={(e) => setForm({ ...form, motivation: e.target.value })} />
                </div>
                <Button type="submit" size="lg" variant="accent" className="w-full" disabled={loading || form.skills.length === 0}>
                  {loading ? 'Submitting…' : t('join')}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  );
}
