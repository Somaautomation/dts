import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardTitle, CardHeader, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GraduationCap, ArrowRightLeft, TrendingUp, Wallet, FileEdit, Megaphone } from 'lucide-react';

const services = [
  { key: 'grievance', icon: GraduationCap, type: 'GRIEVANCE' },
  { key: 'transfer', icon: ArrowRightLeft, type: 'TRANSFER' },
  { key: 'promotion', icon: TrendingUp, type: 'PROMOTION' },
  { key: 'pension', icon: Wallet, type: 'PENSION' },
  { key: 'policy', icon: FileEdit, type: 'POLICY_FEEDBACK' },
  { key: 'representation', icon: Megaphone, type: 'REPRESENTATION' },
] as const;

export default function TeachersPortal({ params: { locale } }: { params: { locale: string } }) {
  const t = useTranslations('teachers');
  return (
    <>
      <section className="gradient-brand text-white py-16">
        <div className="container-page">
          <h1 className="text-4xl md:text-5xl font-bold">{t('title')}</h1>
          <p className="mt-3 text-white/85 max-w-2xl">{t('subtitle')}</p>
          <div className="mt-6">
            <Link href={`/${locale}/teachers/register`}><Button variant="accent" size="lg">Register as Teacher</Button></Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-page">
          <div className="bg-brand-saffron/10 border border-brand-saffron/30 rounded-lg p-4 mb-8 text-center text-brand-blue font-semibold">
            {t('workflow')}
          </div>
          <h2 className="text-2xl font-bold text-brand-blue mb-6">Services</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map(({ key, icon: Icon, type }) => (
              <Card key={key} className="hover:-translate-y-1 transition-transform">
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg gradient-brand text-white grid place-items-center mb-2"><Icon className="h-6 w-6" /></div>
                  <CardTitle>{t(`services.${key}` as any)}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Link href={`/${locale}/teachers/request?type=${type}`}>
                    <Button variant="outline" size="sm" className="w-full">File Request</Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
