import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { prisma } from '@/lib/prisma';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin } from 'lucide-react';

import { EventCalendar } from '@/components/events/event-calendar';

export const revalidate = 600;

export default async function EventsPage({ params: { locale } }: { params: { locale: string } }) {
  const [upcoming, past] = await Promise.all([
    prisma.event.findMany({ where: { isPublic: true, startsAt: { gt: new Date() } }, orderBy: { startsAt: 'asc' } }).catch(() => []),
    prisma.event.findMany({ where: { endsAt: { lt: new Date() } }, orderBy: { startsAt: 'desc' }, take: 9 }).catch(() => []),
  ]);
  const events = await prisma.event.findMany({ where: { isPublic: true }, orderBy: { startsAt: 'asc' } }).catch(() => []);
  return <View locale={locale} upcoming={upcoming} past={past} events={events} />;
}

function View({ locale, upcoming, past, events }: any) {
  const t = useTranslations('events');
  return (
    <>
      <section className="gradient-brand text-white py-16">
        <div className="container-page">
          <h1 className="text-4xl md:text-5xl font-bold">{t('title')}</h1>
          <p className="mt-3 text-white/85 max-w-2xl">{t('subtitle')}</p>
        </div>
      </section>

      <EventCalendar locale={locale} events={events} />

      <section className="section">
        <div className="container-page space-y-12">
          <div>
            <h2 className="text-2xl font-bold text-brand-blue mb-6">{t('upcoming')}</h2>
            {upcoming.length === 0 ? (
              <p className="text-muted-foreground">No upcoming events.</p>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {upcoming.map((e: any) => <EventCard key={e.id} locale={locale} event={e} />)}
              </div>
            )}
          </div>
          {past.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-brand-blue mb-6">{t('past')}</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {past.map((e: any) => <EventCard key={e.id} locale={locale} event={e} muted />)}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

function EventCard({ event, locale, muted }: { event: any; locale: string; muted?: boolean }) {
  return (
    <Card className={muted ? 'opacity-80' : ''}>
      <CardHeader>
        <CardTitle>{locale === 'kn' && event.titleKn ? event.titleKn : event.title}</CardTitle>
        <CardDescription className="flex items-center gap-1"><Calendar className="h-4 w-4" />{new Date(event.startsAt).toLocaleString('en-IN')}</CardDescription>
        <CardDescription className="flex items-center gap-1"><MapPin className="h-4 w-4" />{event.venue}, {event.district}</CardDescription>
      </CardHeader>
      <CardContent>
        <Link href={`/${locale}/events/${event.slug}`}>
          <Button variant={muted ? 'outline' : 'default'} size="sm" className="w-full">{muted ? 'View details' : 'Register'}</Button>
        </Link>
      </CardContent>
    </Card>
  );
}
