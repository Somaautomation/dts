import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Reveal, Stagger, StaggerItem } from '@/components/motion/reveal';

export const revalidate = 3600;

export default async function AboutPage({ params: { locale } }: { params: { locale: string } }) {
  const timeline = await prisma.timelineEvent.findMany({ orderBy: [{ year: 'asc' }, { order: 'asc' }] }).catch(() => []);
  return <AboutContent locale={locale} timeline={timeline} />;
}

function AboutContent({ locale, timeline }: { locale: string; timeline: any[] }) {
  const t = useTranslations('about');
  const sections = [
    { key: 'earlyLife', body: 'Born and raised in Karnataka, D.T. Srinivas grew up with a deep commitment to social service and education. His early years instilled the values of equality, fairness, and community responsibility.' },
    { key: 'education', body: 'Holding Doctorate (D.Ph.), B.E. (Civil), M.A., LL.B., and MBA qualifications, he combined academic excellence with active participation in student bodies and community organizations, championing education for all.' },
    { key: 'publicService', body: 'Decades of work with marginalized communities, championing welfare, dignity, and opportunity for OBC, Category-1, and Yadava communities.' },
    { key: 'politicalJourney', body: 'A respected voice in Karnataka politics, he was elected as Member of the Legislative Council representing the South East Teachers Constituency.' },
    { key: 'communityLeadership', body: 'State President of the Yadava Sangha and Category-1 Federation, and Chairman of the Karnataka State OBC Department.' },
    { key: 'educationalLeadership', body: 'Secretary, SEA Group of Institutions — driving educational excellence and access for thousands of students.' },
  ] as const;

  return (
    <>
      <section className="gradient-brand text-white py-16">
        <div className="container-page">
          <Reveal>
            <h1 className="text-4xl md:text-5xl font-bold">{t('title')}</h1>
            <p className="mt-3 text-white/85 max-w-2xl">A journey of service, leadership and reform.</p>
          </Reveal>
          <Reveal className="mt-6" delay={0.08}>
            <div className="max-w-3xl rounded-2xl bg-white/10 border border-white/20 backdrop-blur px-6 py-5">
              <p className="text-white/95 text-base md:text-lg leading-relaxed">
                <strong className="font-bold text-white">D.T. Srinivas</strong> is a distinguished educationist, social leader, and Member of the Karnataka Legislative Council representing the <strong className="text-brand-saffron">Karnataka South East Teachers&apos; Constituency</strong>. Holding qualifications including
                {' '}<span className="font-semibold">Doctorate (D.Ph.), B.E. (Civil), M.A., LL.B., and MBA</span>, he has dedicated his career to education, public service, and the welfare of teachers and students across Karnataka.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {['D.Ph.', 'B.E. (Civil)', 'M.A.', 'LL.B.', 'MBA'].map((q) => (
                  <span key={q} className="inline-flex items-center rounded-full bg-white/15 border border-white/25 px-3 py-0.5 text-xs font-bold text-white tracking-wide">{q}</span>
                ))}
              </div>
            </div>
          </Reveal>
          <Reveal className="mt-6 flex flex-wrap gap-3" delay={0.12} y={12}>
            <Link href={`/${locale}/membership/join`}>
              <Button variant="accent" size="lg" className="pulse-glow">Join Supporters Network</Button>
            </Link>
            <Link href={`/${locale}/contact`}>
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-brand-blue">Contact Office</Button>
            </Link>
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="container-page">
          <Reveal>
            <h2 className="text-3xl font-bold text-brand-blue mb-8">{t('biographyTitle')}</h2>
          </Reveal>
          <Stagger className="grid md:grid-cols-2 gap-5">
            {sections.map((s) => (
              <StaggerItem key={s.key}>
                <Card className="card-advanced">
                  <CardHeader><CardTitle>{t(s.key)}</CardTitle></CardHeader>
                  <CardContent><p className="text-gray-700 leading-relaxed">{s.body}</p></CardContent>
                </Card>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="section bg-brand-gray">
        <div className="container-page">
          <Reveal>
            <h2 className="text-3xl font-bold text-brand-blue mb-10">{t('timelineTitle')}</h2>
          </Reveal>
          <Stagger className="relative border-l-4 border-brand-saffron pl-8 space-y-8">
            {timeline.map((e) => (
              <StaggerItem key={e.id}>
                <div className="relative">
                <div className="absolute -left-[42px] h-6 w-6 rounded-full bg-brand-saffron border-4 border-brand-gray" />
                <Badge variant="primary">{e.year}</Badge>
                <h3 className="text-xl font-bold text-brand-blue mt-1">{locale === 'kn' && e.titleKn ? e.titleKn : e.title}</h3>
                <p className="text-gray-700 mt-1">{locale === 'kn' && e.descriptionKn ? e.descriptionKn : e.description}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>
    </>
  );
}
