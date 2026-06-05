"use client";

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Calendar, Clock, MessageSquare, Phone, StickyNote, User } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input, Label, Textarea } from '@/components/ui/input';

type AppointmentFormProps = {
  locale: string;
  eventTitle?: string;
  eventSlug?: string;
  initialDate?: string;
  initialTime?: string;
};

export function BookAppointmentForm({ locale, eventTitle, eventSlug, initialDate, initialTime }: AppointmentFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    phone: '',
    preferredDate: initialDate ?? '',
    preferredTime: initialTime ?? '',
    notes: '',
  });

  const waPhone = useMemo(() => {
    const digits = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '').replace(/\D/g, '');
    if (!digits) return '';
    return digits.startsWith('91') ? digits : `91${digits}`;
  }, []);

  const localized = locale === 'kn' ? 'kn-IN' : 'en-IN';

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventSlug,
          name: form.name,
          phone: form.phone,
          preferredDate: form.preferredDate,
          preferredTime: form.preferredTime,
          notes: form.notes,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Unable to submit appointment request');

      if (waPhone) {
        const lines = [
          `Appointment request submitted: ${data.ticketId}`,
          `Name: ${form.name}`,
          `Phone: ${form.phone}`,
          eventTitle ? `Event: ${eventTitle}` : undefined,
          form.preferredDate ? `Preferred date: ${new Date(form.preferredDate).toLocaleDateString(localized)}` : undefined,
          form.preferredTime ? `Preferred time: ${form.preferredTime}` : undefined,
          form.notes ? `Notes: ${form.notes}` : undefined,
        ].filter(Boolean);
        const url = `https://wa.me/${waPhone}?text=${encodeURIComponent(lines.join('\n'))}`;
        window.open(url, '_blank', 'noopener,noreferrer');
      }

      toast.success(`Appointment submitted: ${data.ticketId}`);
      router.push(`/${locale}/dashboard`);
    } catch (error: any) {
      toast.error(error.message || 'Unable to submit appointment request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="card-advanced">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><MessageSquare className="h-5 w-5 text-brand-saffron" /> Book an Appointment</CardTitle>
        <CardDescription>Select your preferred date and time to request a meeting with the office.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <Label htmlFor="name" className="flex items-center gap-2"><User className="h-4 w-4" /> Name</Label>
            <Input id="name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your name" />
          </div>
          <div>
            <Label htmlFor="phone" className="flex items-center gap-2"><Phone className="h-4 w-4" /> Mobile Number</Label>
            <Input id="phone" required inputMode="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="10-digit mobile number" />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="preferredDate" className="flex items-center gap-2"><Calendar className="h-4 w-4" /> Preferred Date</Label>
              <Input id="preferredDate" type="date" value={form.preferredDate} onChange={(e) => setForm({ ...form, preferredDate: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="preferredTime" className="flex items-center gap-2"><Clock className="h-4 w-4" /> Preferred Time</Label>
              <Input id="preferredTime" type="time" value={form.preferredTime} onChange={(e) => setForm({ ...form, preferredTime: e.target.value })} />
            </div>
          </div>
          <div>
            <Label htmlFor="notes" className="flex items-center gap-2"><StickyNote className="h-4 w-4" /> Notes</Label>
            <Textarea id="notes" rows={4} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Reason for appointment or meeting agenda" />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>{loading ? 'Submitting…' : 'Send Appointment Request'}</Button>
        </form>
      </CardContent>
    </Card>
  );
}
