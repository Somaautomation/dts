import { useTranslations } from 'next-intl';
import { prisma } from '@/lib/prisma';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp } from 'lucide-react';

export const revalidate = 1800;

export default async function AchievementsPage({ params: { locale } }: { params: { locale: string } }) {
  const items = await prisma.achievement.findMany({ where: { published: true }, orderBy: { achievedOn: 'desc' } }).catch(() => []);
  return <View locale={locale} items={items} />;
}

function View({ locale, items }: { locale: string; items: any[] }) {
  const t = useTranslations('achievements');
  const grouped = items.reduce<Record<string, any[]>>((acc, it) => {
    (acc[it.category] ??= []).push(it);
    return acc;
  }, {});

  return (
    <>
      <section className="gradient-brand text-white py-16">
        <div className="container-page">
          <h1 className="text-4xl md:text-5xl font-bold">{t('title')}</h1>
          <p className="mt-3 text-white/85 max-w-2xl">{t('subtitle')}</p>
        </div>
      </section>

      <section className="section">
        <div className="container-page space-y-12">
          {Object.entries(grouped).map(([category, list]) => (
            <div key={category}>
              <h2 className="text-2xl font-bold text-brand-blue mb-4">{category.replace('_', ' ')}</h2>
              <div className="w-12 h-1 bg-brand-saffron mb-6 rounded" />
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {list.map((a) => (
                  <Card key={a.id}>
                    <CardHeader>
                      <Badge variant="success">{new Date(a.achievedOn).getFullYear()}</Badge>
                      <CardTitle className="mt-2">{locale === 'kn' && a.titleKn ? a.titleKn : a.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription>{locale === 'kn' && a.summaryKn ? a.summaryKn : a.summary}</CardDescription>
                      {a.impactStat && (
                        <div className="mt-4 inline-flex items-center gap-1 text-brand-green font-semibold text-sm">
                          <TrendingUp className="h-4 w-4" />{a.impactStat}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
          {items.length === 0 && (
            <p className="text-center text-muted-foreground py-12">Achievements will appear here soon.</p>
          )}
        </div>
      </section>
    </>
  );
}
