import Link from 'next/link';
import { notFound } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Calendar, MapPin, Clock } from 'lucide-react';

import { prisma } from '@/lib/prisma';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export const revalidate = 600;

export default async function EventDetailPage({ params }: { params: { locale: string; slug: string } }) {
  const event = await prisma.event.findUnique({ where: { slug: params.slug } }).catch(() => null);
  if (!event) notFound();
  return <View locale={params.locale} event={event} />;
}

function View({ locale, event }: { locale: string; event: any }) {
  const t = useTranslations('events');
  const startsAt = new Date(event.startsAt);
  const endsAt = new Date(event.endsAt);
  const localized = locale === 'kn' ? 'kn-IN' : 'en-IN';

  return (
    <>
      <section className="gradient-brand text-white py-16">
        <div className="container-page">
          <Badge variant="warning" className="bg-white/10 text-white border-white/20">{t('upcoming')}</Badge>
          <h1 className="mt-4 text-4xl md:text-5xl font-bold leading-tight">
            {locale === 'kn' && event.titleKn ? event.titleKn : event.title}
          </h1>
          <p className="mt-3 text-white/85 max-w-2xl">{locale === 'kn' && event.descriptionKn ? event.descriptionKn : event.description}</p>
        </div>
      </section>

      <section className="section">
        <div className="container-page grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <Card className="card-advanced">
            <CardHeader>
              <CardTitle>{t('title')}</CardTitle>
              <CardDescription>{event.venue}, {event.district}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-gray-700">
              <p className="flex items-center gap-2"><Calendar className="h-4 w-4 text-brand-blue" />{startsAt.toLocaleDateString(localized, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
              <p className="flex items-center gap-2"><Clock className="h-4 w-4 text-brand-blue" />{startsAt.toLocaleTimeString(localized, { hour: '2-digit', minute: '2-digit' })} - {endsAt.toLocaleTimeString(localized, { hour: '2-digit', minute: '2-digit' })}</p>
              <p className="flex items-center gap-2"><MapPin className="h-4 w-4 text-brand-blue" />{event.venue}{event.address ? `, ${event.address}` : ''}</p>
              <div className="pt-4">
                <Link href={`/${locale}/events`}>
                  <Button variant="outline">{t('viewDetails')}</Button>
                </Link>
                <Link href={`/${locale}/appointments/book?eventSlug=${encodeURIComponent(event.slug)}&date=${toDateInput(startsAt)}&time=${toTimeInput(startsAt)}`}>
                  <Button className="ml-3">{t('bookAppointment')}</Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="card-advanced h-fit">
            <CardHeader>
              <CardTitle>{t('register')}</CardTitle>
              <CardDescription>{t('scanQr')}</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href={`/${locale}/events`}>
                <Button className="w-full">{t('register')}</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  );
}

function toDateInput(date: Date) {
  return [date.getFullYear(), String(date.getMonth() + 1).padStart(2, '0'), String(date.getDate()).padStart(2, '0')].join('-');
}

function toTimeInput(date: Date) {
  return [String(date.getHours()).padStart(2, '0'), String(date.getMinutes()).padStart(2, '0')].join(':');
}