import Link from 'next/link';
import { notFound } from 'next/navigation';
import { redirect } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { getServerSession } from 'next-auth';

import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookAppointmentForm } from '@/components/appointments/book-appointment-form';

export const revalidate = 600;

export default async function AppointmentPage({ params, searchParams }: { params: { locale: string }; searchParams?: Record<string, string | string[] | undefined> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect(`/${params.locale}/auth/login?next=/appointments/book`);

  const eventSlug = getQuery(searchParams?.eventSlug);
  const event = eventSlug ? await prisma.event.findUnique({ where: { slug: eventSlug } }).catch(() => null) : null;
  if (eventSlug && !event) notFound();

  const initialDate = getQuery(searchParams?.date) || (event ? toDateInput(new Date(event.startsAt)) : '');
  const initialTime = getQuery(searchParams?.time) || (event ? toTimeInput(new Date(event.startsAt)) : '');

  return <View locale={params.locale} event={event} initialDate={initialDate} initialTime={initialTime} />;
}

function View({ locale, event, initialDate, initialTime }: { locale: string; event: any; initialDate: string; initialTime: string }) {
  const t = useTranslations('events');

  return (
    <>
      <section className="gradient-brand text-white py-16">
        <div className="container-page">
          <h1 className="text-4xl md:text-5xl font-bold">{t('appointmentTitle')}</h1>
          <p className="mt-3 text-white/85 max-w-2xl">{t('appointmentSubtitle')}</p>
        </div>
      </section>

      <section className="section bg-brand-gray">
        <div className="container-page grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <BookAppointmentForm
            locale={locale}
            eventTitle={event ? (locale === 'kn' && event.titleKn ? event.titleKn : event.title) : undefined}
            eventSlug={event?.slug}
            initialDate={initialDate}
            initialTime={initialTime}
          />

          <Card className="card-advanced h-fit">
            <CardHeader>
              <CardTitle>{t('appointmentHelpTitle')}</CardTitle>
              <CardDescription>{t('appointmentHelpSubtitle')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-gray-700">
              <p>{t('appointmentHelpOne')}</p>
              <p>{t('appointmentHelpTwo')}</p>
              <Link href={event ? `/${locale}/events/${event.slug}` : `/${locale}/events`}>
                <Button variant="outline" className="w-full">{event ? t('viewDetails') : t('upcoming')}</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  );
}

function getQuery(value?: string | string[]) {
  if (Array.isArray(value)) return value[0];
  return value ?? '';
}

function toDateInput(date: Date) {
  return [date.getFullYear(), String(date.getMonth() + 1).padStart(2, '0'), String(date.getDate()).padStart(2, '0')].join('-');
}

function toTimeInput(date: Date) {
  return [String(date.getHours()).padStart(2, '0'), String(date.getMinutes()).padStart(2, '0')].join(':');
}
