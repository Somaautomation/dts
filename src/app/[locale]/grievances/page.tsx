import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardTitle } from '@/components/ui/card';

export default function GrievancesIndex({ params: { locale } }: { params: { locale: string } }) {
  const t = useTranslations('grievances');
  return (
    <>
      <section className="gradient-brand text-white py-16">
        <div className="container-page">
          <h1 className="text-4xl md:text-5xl font-bold">{t('title')}</h1>
          <p className="mt-3 text-white/85 max-w-2xl">{t('subtitle')}</p>
          <div className="mt-6 flex gap-3">
            <Link href={`/${locale}/grievances/new`}><Button variant="accent" size="lg">{t('submit')}</Button></Link>
            <Link href={`/${locale}/grievances/track`}><Button size="lg" className="bg-white text-brand-blue hover:bg-white/90">{t('track')}</Button></Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-page">
          <h2 className="text-2xl font-bold text-brand-blue mb-6">Categories</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {Object.keys(t.raw('categories') as Record<string, string>).map((key) => (
              <Card key={key} className="text-center">
                <CardContent className="p-4">
                  <CardTitle className="text-sm">{t(`categories.${key}` as any)}</CardTitle>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
