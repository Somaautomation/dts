"use client";

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock, MapPin } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

type EventItem = {
  id: string;
  slug: string;
  title: string;
  titleKn?: string | null;
  startsAt: string | Date;
  endsAt: string | Date;
  venue: string;
  district: string;
};

export function EventCalendar({ locale, events }: { locale: string; events: EventItem[] }) {
  const t = useTranslations('events');
  const initialDate = useMemo(() => {
    const firstEvent = events[0];
    return firstEvent ? new Date(firstEvent.startsAt) : new Date();
  }, [events]);

  const [selectedDate, setSelectedDate] = useState(() => startOfDay(initialDate));
  const [visibleMonth, setVisibleMonth] = useState(() => new Date(selectedDate));

  const localized = locale === 'kn' ? 'kn-IN' : 'en-IN';
  const selectedKey = toDateKey(selectedDate);

  const monthGrid = useMemo(() => buildMonthGrid(visibleMonth), [visibleMonth]);
  const monthEvents = useMemo(() => events.filter((event) => isInMonth(event, visibleMonth)), [events, visibleMonth]);
  const selectedEvents = useMemo(() => events.filter((event) => occursOnDate(event, selectedDate)), [events, selectedDate]);

  return (
    <section className="section bg-brand-gray">
      <div className="container-page">
        <div className="mb-8 space-y-2">
          <h2 className="text-3xl font-bold text-brand-blue">{t('calendarTitle')}</h2>
          <p className="text-muted-foreground max-w-2xl">{t('calendarSubtitle')}</p>
          <div className="w-16 h-1 bg-brand-saffron rounded" />
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.35fr_0.9fr]">
          <Card className="card-advanced overflow-hidden">
            <CardHeader className="space-y-4 border-b bg-white/70">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <CalendarIcon className="h-5 w-5 text-brand-saffron" />
                    {visibleMonth.toLocaleDateString(localized, { month: 'long', year: 'numeric' })}
                  </CardTitle>
                  <CardDescription>{t('selectDate')}</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" onClick={() => shiftMonth(-1)} aria-label="Previous month">
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={() => shiftMonth(1)} aria-label="Next month">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-2 text-center text-xs font-medium text-muted-foreground">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <div key={day} className="py-1">{day}</div>
                ))}
              </div>
            </CardHeader>

            <CardContent className="p-4">
              <div className="grid grid-cols-7 gap-2">
                {monthGrid.map((cell, index) => {
                  const isSelected = cell && toDateKey(cell) === selectedKey;
                  const hasEvents = cell ? events.some((event) => occursOnDate(event, cell)) : false;
                  const isToday = cell ? isSameDay(cell, new Date()) : false;

                  if (!cell) {
                    return <div key={`blank-${index}`} className="h-14 rounded-lg bg-transparent" />;
                  }

                  return (
                    <button
                      key={toDateKey(cell)}
                      type="button"
                      onClick={() => {
                        setSelectedDate(startOfDay(cell));
                        setVisibleMonth(new Date(cell.getFullYear(), cell.getMonth(), 1));
                      }}
                      className={`group relative h-14 rounded-lg border p-2 text-left transition ${isSelected ? 'border-brand-blue bg-brand-blue/10 shadow-sm' : isToday ? 'border-brand-saffron bg-brand-saffron/10' : 'border-border bg-white hover:border-brand-saffron/60 hover:bg-brand-saffron/5'} ${hasEvents ? 'ring-1 ring-brand-saffron/20' : ''}`}
                    >
                      <div className={`text-sm font-semibold ${isSelected ? 'text-brand-blue' : 'text-foreground'}`}>{cell.getDate()}</div>
                      {hasEvents ? <span className="absolute bottom-2 right-2 h-2 w-2 rounded-full bg-brand-saffron" /> : null}
                    </button>
                  );
                })}
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-brand-blue/20 border border-brand-blue/30" /> {t('selectedDate')}</span>
                <span className="inline-flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-brand-saffron/20 border border-brand-saffron/40" /> {t('daysWithEvents')}</span>
              </div>

              <div className="mt-6 rounded-xl border bg-white p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm text-muted-foreground">{t('selectedDate')}</p>
                    <p className="text-lg font-semibold text-brand-blue">{selectedDate.toLocaleDateString(localized, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
                  </div>
                  <Badge variant="warning">{selectedEvents.length} {selectedEvents.length === 1 ? t('event') : t('events')}</Badge>
                </div>

                <div className="mt-4 space-y-3">
                  {selectedEvents.length === 0 ? (
                    <p className="text-sm text-muted-foreground">{t('noEventsOnDate')}</p>
                  ) : selectedEvents.map((event) => {
                    const startsAt = new Date(event.startsAt);
                    const endsAt = new Date(event.endsAt);
                    return (
                      <div key={event.id} className="rounded-lg border p-3">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="font-semibold text-brand-blue">{locale === 'kn' && event.titleKn ? event.titleKn : event.title}</p>
                            <div className="mt-2 flex flex-wrap gap-3 text-sm text-muted-foreground">
                              <span className="inline-flex items-center gap-1"><Clock className="h-4 w-4" />{formatTimeRange(startsAt, endsAt, localized)}</span>
                              <span className="inline-flex items-center gap-1"><MapPin className="h-4 w-4" />{event.venue}, {event.district}</span>
                            </div>
                          </div>
                        </div>
                        <div className="mt-4 flex flex-wrap gap-2">
                          <Link href={`/${locale}/events/${event.slug}`}>
                            <Button size="sm" variant="outline">{t('viewDetails')}</Button>
                          </Link>
                          <Link href={`/${locale}/appointments/book?eventSlug=${encodeURIComponent(event.slug)}&date=${toDateInput(startsAt)}&time=${toTimeInput(startsAt)}`}>
                            <Button size="sm">{t('bookAppointment')}</Button>
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-advanced h-fit">
            <CardHeader>
              <CardTitle>{t('monthHighlights')}</CardTitle>
              <CardDescription>{monthEvents.length} {monthEvents.length === 1 ? t('event') : t('events')} {t('inThisMonth')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {monthEvents.length === 0 ? (
                <p className="text-sm text-muted-foreground">{t('noEventsOnDate')}</p>
              ) : monthEvents.slice(0, 6).map((event) => {
                const startsAt = new Date(event.startsAt);
                return (
                  <button
                    key={event.id}
                    type="button"
                    onClick={() => {
                      setSelectedDate(startOfDay(startsAt));
                      setVisibleMonth(new Date(startsAt.getFullYear(), startsAt.getMonth(), 1));
                    }}
                    className={`w-full rounded-lg border p-3 text-left transition hover:border-brand-saffron/60 hover:bg-brand-saffron/5 ${toDateKey(startsAt) === selectedKey ? 'border-brand-blue bg-brand-blue/10' : 'bg-white'}`}
                  >
                    <p className="font-semibold text-brand-blue">{locale === 'kn' && event.titleKn ? event.titleKn : event.title}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{startsAt.toLocaleDateString(localized, { day: 'numeric', month: 'short' })} • {startsAt.toLocaleTimeString(localized, { hour: '2-digit', minute: '2-digit' })}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Link href={`/${locale}/events/${event.slug}`}>
                        <Button size="sm" variant="outline">{t('viewDetails')}</Button>
                      </Link>
                      <Link href={`/${locale}/appointments/book?eventSlug=${encodeURIComponent(event.slug)}&date=${toDateInput(startsAt)}&time=${toTimeInput(startsAt)}`}>
                        <Button size="sm">{t('bookAppointment')}</Button>
                      </Link>
                    </div>
                  </button>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );

  function shiftMonth(delta: number) {
    setVisibleMonth((current) => new Date(current.getFullYear(), current.getMonth() + delta, 1));
  }
}

function buildMonthGrid(date: Date) {
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const cells: Array<Date | null> = [];

  for (let i = 0; i < firstDay; i += 1) cells.push(null);
  for (let day = 1; day <= daysInMonth; day += 1) cells.push(new Date(date.getFullYear(), date.getMonth(), day));
  return cells;
}

function occursOnDate(event: EventItem, date: Date) {
  const start = startOfDay(new Date(event.startsAt));
  const end = endOfDay(new Date(event.endsAt));
  const target = date.getTime();
  return target >= start.getTime() && target <= end.getTime();
}

function isInMonth(event: EventItem, date: Date) {
  const startsAt = new Date(event.startsAt);
  const endsAt = new Date(event.endsAt);
  return (
    (startsAt.getFullYear() === date.getFullYear() && startsAt.getMonth() === date.getMonth()) ||
    (endsAt.getFullYear() === date.getFullYear() && endsAt.getMonth() === date.getMonth())
  );
}

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function endOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999);
}

function isSameDay(left: Date, right: Date) {
  return toDateKey(left) === toDateKey(right);
}

function toDateKey(date: Date) {
  return [date.getFullYear(), String(date.getMonth() + 1).padStart(2, '0'), String(date.getDate()).padStart(2, '0')].join('-');
}

function formatTimeRange(startsAt: Date, endsAt: Date, locale: string) {
  const start = startsAt.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' });
  const end = endsAt.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' });
  return `${start} - ${end}`;
}

function toDateInput(date: Date) {
  return [date.getFullYear(), String(date.getMonth() + 1).padStart(2, '0'), String(date.getDate()).padStart(2, '0')].join('-');
}

function toTimeInput(date: Date) {
  return [String(date.getHours()).padStart(2, '0'), String(date.getMinutes()).padStart(2, '0')].join(':');
}