import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { prisma } from '@/lib/prisma';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const revalidate = 600;

export default async function NewsPage({ params: { locale } }: { params: { locale: string } }) {
  const items = await prisma.newsArticle.findMany({ orderBy: [{ isPinned: 'desc' }, { publishedAt: 'desc' }] }).catch(() => []);
  return <View locale={locale} items={items} />;
}

function View({ locale, items }: { locale: string; items: any[] }) {
  const t = useTranslations('news');
  return (
    <>
      <section className="gradient-brand text-white py-16">
        <div className="container-page">
          <h1 className="text-4xl md:text-5xl font-bold">{t('title')}</h1>
          <p className="mt-3 text-white/85 max-w-2xl">{t('subtitle')}</p>
        </div>
      </section>

      <section className="section">
        <div className="container-page">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((n) => (
              <Card key={n.id}>
                <CardHeader>
                  <Badge variant="info">{n.type.replace('_', ' ')}</Badge>
                  <CardTitle className="mt-2">{locale === 'kn' && n.titleKn ? n.titleKn : n.title}</CardTitle>
                  <CardDescription>{new Date(n.publishedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 text-sm">{locale === 'kn' && n.excerptKn ? n.excerptKn : n.excerpt}</p>
                  <Link href={`/${locale}/news/${n.slug}`} className="text-brand-blue font-semibold text-sm mt-3 inline-block">{t('readMore')} →</Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
