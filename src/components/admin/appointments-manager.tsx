"use client";

import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label, Textarea } from '@/components/ui/input';

type Appointment = {
  id: string;
  ticketId: string;
  name: string;
  phone: string;
  preferredDate: string;
  preferredTime: string;
  notes?: string | null;
  status: 'REQUESTED' | 'CONFIRMED' | 'RESCHEDULED' | 'COMPLETED' | 'CANCELLED';
  adminNotes?: string | null;
  event?: { title: string; titleKn?: string | null; slug: string } | null;
  user: { name: string; phone: string; district?: string | null; taluk?: string | null };
};

const STATUS_OPTIONS = ['REQUESTED', 'CONFIRMED', 'RESCHEDULED', 'COMPLETED', 'CANCELLED'] as const;

export function AppointmentsManager({ locale }: { locale: string }) {
  const [items, setItems] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/appointments');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to load appointments');
      setItems(data.items ?? []);
    } catch (e: any) {
      toast.error(e.message || 'Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const updateStatus = async (id: string, status: Appointment['status'], adminNotes?: string) => {
    setSavingId(id);
    try {
      const res = await fetch('/api/appointments', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status, adminNotes }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update status');
      toast.success('Appointment updated');
      await load();
    } catch (e: any) {
      toast.error(e.message || 'Failed to update appointment');
    } finally {
      setSavingId(null);
    }
  };

  return (
    <section className="section bg-brand-gray min-h-[calc(100vh-4rem)]">
      <div className="container-page space-y-6">
        <div className="flex items-center justify-between gap-3">
          <h1 className="text-3xl font-bold text-brand-blue">Appointment Management</h1>
          <Button variant="outline" onClick={load} disabled={loading}>{loading ? 'Refreshing…' : 'Refresh'}</Button>
        </div>

        {items.length === 0 && !loading ? (
          <Card><CardContent className="p-6 text-sm text-muted-foreground">No appointment requests yet.</CardContent></Card>
        ) : (
          <div className="grid gap-4">
            {items.map((item) => (
              <Card key={item.id}>
                <CardHeader>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <CardTitle className="text-lg">{item.ticketId}</CardTitle>
                    <Badge variant={item.status === 'CONFIRMED' ? 'success' : item.status === 'CANCELLED' ? 'warning' : 'info'}>{item.status}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <p><span className="font-semibold">Citizen:</span> {item.name} ({item.phone})</p>
                    <p><span className="font-semibold">Preferred slot:</span> {new Date(item.preferredDate).toLocaleDateString('en-IN')} at {item.preferredTime}</p>
                    <p><span className="font-semibold">Event:</span> {item.event?.title ?? 'General appointment'}</p>
                    <p><span className="font-semibold">Location:</span> {item.user.district ?? 'N/A'}{item.user.taluk ? `, ${item.user.taluk}` : ''}</p>
                  </div>

                  {item.notes ? <p className="text-sm text-gray-700"><span className="font-semibold">Citizen notes:</span> {item.notes}</p> : null}

                  <div className="grid lg:grid-cols-[220px_1fr_160px] gap-3 items-end">
                    <div>
                      <Label>Status</Label>
                      <select
                        className="flex h-11 w-full rounded-md border bg-white px-3"
                        value={item.status}
                        onChange={(e) => {
                          setItems((prev) => prev.map((p) => p.id === item.id ? { ...p, status: e.target.value as Appointment['status'] } : p));
                        }}
                      >
                        {STATUS_OPTIONS.map((status) => <option key={status} value={status}>{status}</option>)}
                      </select>
                    </div>
                    <div>
                      <Label>Admin Notes</Label>
                      <Textarea
                        rows={2}
                        value={item.adminNotes ?? ''}
                        onChange={(e) => setItems((prev) => prev.map((p) => p.id === item.id ? { ...p, adminNotes: e.target.value } : p))}
                        placeholder="Optional internal note"
                      />
                    </div>
                    <Button
                      onClick={() => updateStatus(item.id, item.status, item.adminNotes ?? undefined)}
                      disabled={savingId === item.id}
                    >
                      {savingId === item.id ? 'Saving…' : 'Update'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
