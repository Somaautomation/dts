import Link from 'next/link';
import Image from 'next/image';
import fs from 'node:fs';
import path from 'node:path';
import { useTranslations } from 'next-intl';
import { ArrowRight, Users, GraduationCap, FileText, Calendar, TrendingUp, Megaphone, HandHeart } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardTitle, CardDescription, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { prisma } from '@/lib/prisma';
import { PhotoMarquee } from '@/components/home/photo-marquee';
import { Reveal, Stagger, StaggerItem } from '@/components/motion/reveal';

export const revalidate = 600; // ISR — 10 minutes

const FALLBACK_GALLERY_FILES = [
  '11.jpg',
  '10.jpg',
  '09.jpg',
  '08.jpg',
  '07.jpg',
  '06.jpg',
  '04.jpg',
  '03.jpg',
  '02.jpg',
  '01-dt-srinivas.jpg',
];

const roles = [
  'Member of the Legislative Council (MLC)',
  'South East Teachers Constituency',
  'Chairman, Karnataka State OBC Department',
  'State President, Karnataka State Category-1 Castes Federation',
  'State President, Karnataka State Yadava Sangha',
  'Secretary, SEA Group of Institutions',
];

export default async function HomePage({ params: { locale } }: { params: { locale: string } }) {
  const [achievements, events, news, stats] = await Promise.all([
    prisma.achievement.findMany({ where: { published: true }, orderBy: { achievedOn: 'desc' }, take: 3 }).catch(() => []),
    prisma.event.findMany({ where: { startsAt: { gt: new Date() } }, orderBy: { startsAt: 'asc' }, take: 3 }).catch(() => []),
    prisma.newsArticle.findMany({ orderBy: { publishedAt: 'desc' }, take: 3 }).catch(() => []),
    getStats(),
  ]);
  const gallery = getGalleryImages();

  return (
    <>
      <HomeT locale={locale} stats={stats} achievements={achievements} events={events} news={news} roles={roles} gallery={gallery} />
    </>
  );
}

function getGalleryImages() {
  const fallback = FALLBACK_GALLERY_FILES.map((f) => ({
    src: `/gallery/${f}`,
    alt: f.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' '),
  }));

  try {
    const dir = path.join(process.cwd(), 'public', 'gallery');
    if (!fs.existsSync(dir)) return fallback;
    const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });
    const discovered = fs
      .readdirSync(dir, { withFileTypes: true })
      .filter((entry) => entry.isFile() && /\.(jpe?g|png|webp|avif)$/i.test(entry.name))
      .map((entry) => entry.name)
      .sort((a, b) => collator.compare(b, a))
      .map((f) => ({ src: `/gallery/${f}`, alt: f.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' ') }));

    return discovered.length ? discovered : fallback;
  } catch { return fallback; }
}

async function getStats() {
  try {
    const [members, grievances, events, teachers] = await Promise.all([
      prisma.membership.count(),
      prisma.grievance.count({ where: { status: { in: ['RESOLVED', 'CLOSED'] } } }),
      prisma.event.count(),
      prisma.teacher.count(),
    ]);
    return { members, grievances, events, teachers };
  } catch {
    return { members: 12500, grievances: 3400, events: 145, teachers: 5200 };
  }
}

function HomeT({ locale, stats, achievements, events, news, roles, gallery }: any) {
  return (
    <>
      <HeroSection locale={locale} />
      <GallerySection images={gallery} />
      <RolesSection roles={roles} />
      <StatsSection stats={stats} />
      <AchievementsSection locale={locale} achievements={achievements} />
      <EventsSection locale={locale} events={events} />
      <NewsSection locale={locale} news={news} />
      <CTASection locale={locale} />
    </>
  );
}

function HeroSection({ locale }: { locale: string }) {
  const t = useTranslations('hero');
  return (
    <section className="relative overflow-hidden gradient-brand text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,153,51,0.25),_transparent_60%)]" />
      <div className="container-page relative py-20 md:py-28 grid gap-10 md:grid-cols-2 items-center">
        <Reveal className="space-y-6">
          <Badge variant="warning" className="bg-brand-saffron/20 text-brand-saffron border-brand-saffron/40">
            Education • Empowerment • Equality • Service
          </Badge>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">{t('title')}</h1>
          <p className="text-lg text-white/85 max-w-xl">{t('subtitle')}</p>
          <Reveal className="flex flex-wrap gap-3 pt-2" delay={0.12} y={10}>
            <Link href={`/${locale}/membership/join`}><Button variant="accent" size="lg" className="pulse-glow">{t('ctaJoin')} <ArrowRight className="h-4 w-4" /></Button></Link>
            <Link href={`/${locale}/volunteer`}><Button size="lg" className="bg-white text-brand-blue hover:bg-white/90">{t('ctaVolunteer')}</Button></Link>
            <Link href={`/${locale}/grievances/new`}><Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-brand-blue">{t('ctaGrievance')}</Button></Link>
            <Link href={`/${locale}/contact`}><Button size="lg" variant="ghost" className="text-white hover:bg-white/10">{t('ctaContact')}</Button></Link>
          </Reveal>
        </Reveal>
        <Reveal className="relative" delay={0.16}>
          <div className="relative aspect-square rounded-2xl overflow-hidden border border-white/20 shadow-2xl bg-white">
            <Image
              src="/dt-srinivas.jpg"
              alt="D.T. Srinivas with Hon'ble D.K. Shivakumar"
              fill
              priority
              sizes="(min-width: 768px) 520px, 100vw"
              className="object-cover float-soft"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/35 to-transparent p-5">
              <p className="text-2xl font-bold text-white drop-shadow">D.T. Srinivas</p>
              <p className="text-white/90 text-sm">MLC, Karnataka Legislative Council</p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function GallerySection({ images }: { images: { src: string; alt: string }[] }) {
  if (!images.length) return null;
  return (
    <section className="section bg-brand-gray">
      <div className="container-page">
        <h2 className="text-3xl font-bold text-brand-blue text-center mb-2">In Action</h2>
        <div className="w-16 h-1 bg-brand-saffron mx-auto mb-8 rounded" />
      </div>
      <PhotoMarquee images={images} speed={50} direction="right" />
    </section>
  );
}

function RolesSection({ roles }: { roles: string[] }) {
  const t = useTranslations('home');
  return (
    <section className="section bg-brand-gray">
      <div className="container-page">
        <Reveal>
          <h2 className="text-3xl font-bold text-brand-blue text-center mb-8">{t('rolesTitle')}</h2>
        </Reveal>
        <Stagger className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {roles.map((role) => (
            <StaggerItem key={role}>
              <Card className="border-l-4 border-l-brand-saffron card-advanced">
                <CardContent className="p-5 flex gap-3 items-start">
                  <div className="grid h-10 w-10 place-items-center rounded-md bg-brand-blue/10 text-brand-blue shrink-0"><HandHeart className="h-5 w-5" /></div>
                  <p className="text-sm font-medium text-gray-800">{role}</p>
                </CardContent>
              </Card>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

function StatsSection({ stats }: { stats: any }) {
  const t = useTranslations('home');
  const items = [
    { icon: <GraduationCap className="h-7 w-7" />, label: t('stats.teachers'), value: stats.teachers },
    { icon: <Users className="h-7 w-7" />, label: t('stats.members'), value: stats.members },
    { icon: <FileText className="h-7 w-7" />, label: t('stats.grievances'), value: stats.grievances },
    { icon: <Calendar className="h-7 w-7" />, label: t('stats.events'), value: stats.events },
  ];
  return (
    <section className="section">
      <div className="container-page">
        <Reveal>
          <h2 className="text-3xl font-bold text-brand-blue text-center mb-2">{t('statsTitle')}</h2>
          <div className="w-16 h-1 bg-brand-saffron mx-auto mb-10 rounded" />
        </Reveal>
        <Stagger className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {items.map((it) => (
            <StaggerItem key={it.label}>
              <Card className="text-center card-advanced">
                <CardContent className="p-6">
                  <div className="mx-auto h-14 w-14 rounded-full gradient-brand text-white grid place-items-center mb-3">{it.icon}</div>
                  <div className="text-3xl font-bold text-brand-blue">{it.value.toLocaleString('en-IN')}+</div>
                  <p className="text-sm text-muted-foreground mt-1">{it.label}</p>
                </CardContent>
              </Card>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

function AchievementsSection({ locale, achievements }: any) {
  const t = useTranslations('home');
  if (!achievements?.length) return null;
  return (
    <section className="section bg-brand-gray">
      <div className="container-page">
        <Reveal className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-brand-blue">{t('featuredAchievements')}</h2>
            <div className="w-16 h-1 bg-brand-green mt-2 rounded" />
          </div>
          <Link href={`/${locale}/achievements`} className="text-brand-blue font-semibold hover:underline inline-flex items-center gap-1">View all <ArrowRight className="h-4 w-4" /></Link>
        </Reveal>
        <Stagger className="grid md:grid-cols-3 gap-6">
          {achievements.map((a: any) => (
            <StaggerItem key={a.id}>
              <Card className="card-advanced">
                <CardHeader>
                  <Badge variant="success" className="w-fit">{a.category.replace('_', ' ')}</Badge>
                  <CardTitle className="mt-2">{locale === 'kn' && a.titleKn ? a.titleKn : a.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{locale === 'kn' && a.summaryKn ? a.summaryKn : a.summary}</CardDescription>
                  {a.impactStat && <div className="mt-3 inline-flex items-center gap-1 text-brand-green font-semibold text-sm"><TrendingUp className="h-4 w-4" />{a.impactStat}</div>}
                </CardContent>
              </Card>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

function EventsSection({ locale, events }: any) {
  const t = useTranslations('home');
  if (!events?.length) return null;
  return (
    <section className="section">
      <div className="container-page">
        <Reveal className="flex items-end justify-between mb-8">
          <h2 className="text-3xl font-bold text-brand-blue">{t('upcomingEvents')}</h2>
          <Link href={`/${locale}/events`} className="text-brand-blue font-semibold hover:underline inline-flex items-center gap-1">View all <ArrowRight className="h-4 w-4" /></Link>
        </Reveal>
        <Stagger className="grid md:grid-cols-3 gap-6">
          {events.map((e: any) => (
            <StaggerItem key={e.id}>
              <Card className="card-advanced">
                <CardHeader>
                  <div className="text-sm text-brand-green font-semibold">{new Date(e.startsAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                  <CardTitle>{locale === 'kn' && e.titleKn ? e.titleKn : e.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{e.venue}, {e.district}</CardDescription>
                  <Link href={`/${locale}/events/${e.slug}`}><Button variant="outline" size="sm" className="mt-4">Register</Button></Link>
                </CardContent>
              </Card>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

function NewsSection({ locale, news }: any) {
  const t = useTranslations('home');
  if (!news?.length) return null;
  return (
    <section className="section bg-brand-gray">
      <div className="container-page">
        <Reveal className="flex items-end justify-between mb-8">
          <h2 className="text-3xl font-bold text-brand-blue">{t('latestNews')}</h2>
          <Link href={`/${locale}/news`} className="text-brand-blue font-semibold hover:underline inline-flex items-center gap-1">View all <ArrowRight className="h-4 w-4" /></Link>
        </Reveal>
        <Stagger className="grid md:grid-cols-3 gap-6">
          {news.map((n: any) => (
            <StaggerItem key={n.id}>
              <Card className="card-advanced">
                <CardHeader>
                  <Badge variant="info" className="w-fit">{n.type.replace('_', ' ')}</Badge>
                  <CardTitle className="mt-2">{locale === 'kn' && n.titleKn ? n.titleKn : n.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{locale === 'kn' && n.excerptKn ? n.excerptKn : n.excerpt}</CardDescription>
                  <Link href={`/${locale}/news/${n.slug}`} className="text-brand-blue font-semibold text-sm mt-3 inline-flex items-center gap-1">Read more <ArrowRight className="h-3 w-3" /></Link>
                </CardContent>
              </Card>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

function CTASection({ locale }: { locale: string }) {
  const t = useTranslations('home');
  return (
    <section className="section">
      <div className="container-page">
        <Reveal>
          <div className="gradient-brand rounded-2xl p-10 md:p-16 text-white text-center relative overflow-hidden">
          <Megaphone className="absolute right-8 top-8 h-20 w-20 text-white/10" />
          <h2 className="text-3xl md:text-4xl font-bold mb-3">{t('joinMovementTitle')}</h2>
          <p className="text-white/85 max-w-2xl mx-auto mb-6">{t('joinMovementText')}</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href={`/${locale}/membership/join`}><Button variant="accent" size="lg">Join Now</Button></Link>
            <Link href={`/${locale}/volunteer`}><Button size="lg" className="bg-white text-brand-blue hover:bg-white/90">Volunteer</Button></Link>
          </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
