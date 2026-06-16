import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { SchemeCard } from '@/components/welfare/scheme-card';
import { Reveal, Stagger, StaggerItem } from '@/components/motion/reveal';

export const metadata = {
  title: 'Karnataka Government Welfare Schemes',
  description: 'Explore and apply for Karnataka Government welfare schemes designed to empower citizens and improve quality of life.',
};

export default function WelfareSchemesPage({ params: { locale } }: { params: { locale: string } }) {
  return <WelfareSchemesContent locale={locale} />;
}

function WelfareSchemesContent({ locale }: { locale: string }) {
  const t = useTranslations('welfare');

  const schemes = [
    {
      icon: '👩‍👧',
      name: 'Gruha Lakshmi',
      description: 'Financial assistance for women heads of eligible households.',
      benefits: [
        '₹2,000 per month financial assistance',
        'Direct transfer to bank accounts',
        'Empowerment of women household heads',
      ],
      eligibility: 'Eligible women heads of Karnataka households with annual income criteria met.',
      applyLink: 'https://sevasindhu.karnataka.gov.in',
    },
    {
      icon: '⚡',
      name: 'Gruha Jyothi',
      description: 'Free electricity support for eligible households.',
      benefits: [
        'Up to 200 units of free electricity per month',
        'Reduced electricity bills',
        'Support for all domestic consumers',
      ],
      eligibility: 'Karnataka domestic electricity consumers meeting scheme requirements with income limits.',
      applyLink: 'https://sevasindhu.karnataka.gov.in',
    },
    {
      icon: '🚌',
      name: 'Shakti Scheme',
      description: 'Free bus travel for women within Karnataka.',
      benefits: [
        'Free travel on eligible state-run buses',
        'Valid for all women across the state',
        'Reduced transportation burden',
      ],
      eligibility: 'All women residents of Karnataka aged 18 years and above.',
      applyLink: 'https://sevasindhu.karnataka.gov.in',
    },
    {
      icon: '🍚',
      name: 'Anna Bhagya',
      description: 'Food security assistance for eligible families.',
      benefits: [
        'Support under Karnataka food security initiatives',
        'Rice/grain distribution at subsidized rates',
        'Nutritional support for families',
      ],
      eligibility: 'Eligible ration card holders with Below Poverty Line (BPL) status.',
      applyLink: 'https://sevasindhugs.karnataka.gov.in',
    },
    {
      icon: '💼',
      name: 'Yuva Nidhi',
      description: 'Financial assistance for unemployed graduates and diploma holders.',
      benefits: [
        'Monthly unemployment assistance as per government guidelines',
        'Support during job search period',
        'Financial stability for educated youth',
      ],
      eligibility: 'Eligible unemployed graduates and diploma holders (Indian nationals) aged 18-35 years.',
      applyLink: 'https://sevasindhu.karnataka.gov.in',
    },
  ];

  return (
    <>
      {/* Header Section */}
      <section className="gradient-brand text-white py-16">
        <div className="container-page">
          <Reveal>
            <h1 className="text-4xl md:text-5xl font-bold">
              {t('title', 'Karnataka Government Welfare Schemes')}
            </h1>
            <p className="mt-3 text-white/85 max-w-3xl text-lg">
              {t(
                'subtitle',
                'Explore and apply for Karnataka Government welfare schemes designed to empower citizens and improve quality of life.'
              )}
            </p>
          </Reveal>
        </div>
      </section>

      {/* Schemes Grid */}
      <section className="section">
        <div className="container-page">
          <Stagger className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {schemes.map((scheme, index) => (
              <StaggerItem key={scheme.name}>
                <SchemeCard
                  icon={scheme.icon}
                  name={scheme.name}
                  description={scheme.description}
                  benefits={scheme.benefits}
                  eligibility={scheme.eligibility}
                  applyLink={scheme.applyLink}
                  applyLabel="Apply Now"
                  index={index}
                />
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Portal Links Section */}
      <section className="section bg-brand-cream">
        <div className="container-page">
          <Reveal>
            <h2 className="text-3xl font-bold text-brand-blue mb-3">
              {t('portalsTitle', 'Official Application Portals')}
            </h2>
            <p className="text-gray-700 mb-8 max-w-2xl">
              {t(
                'portalsDescription',
                'Apply directly to official Karnataka Government portals for these welfare schemes.'
              )}
            </p>
          </Reveal>

          <Stagger className="grid md:grid-cols-2 gap-6">
            {[
              {
                title: 'Seva Sindhu Portal',
                description:
                  'Apply for Gruha Lakshmi, Gruha Jyothi, Shakti Scheme, and Yuva Nidhi.',
                link: 'https://sevasindhu.karnataka.gov.in',
                icon: '🌐',
              },
              {
                title: 'Guarantee Schemes Portal',
                description:
                  'Apply for Anna Bhagya and other food security schemes.',
                link: 'https://sevasindhugs.karnataka.gov.in',
                icon: '✅',
              },
            ].map((portal) => (
              <StaggerItem key={portal.title}>
                <div className="p-6 bg-white rounded-xl border border-brand-gray hover:shadow-lg transition-all duration-300">
                  <div className="text-4xl mb-4">{portal.icon}</div>
                  <h3 className="text-xl font-semibold text-brand-blue mb-2">
                    {portal.title}
                  </h3>
                  <p className="text-gray-700 mb-4">{portal.description}</p>
                  <a href={portal.link} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" className="group">
                      Visit Portal
                      <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform">
                        →
                      </span>
                    </Button>
                  </a>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section">
        <div className="container-page text-center">
          <Reveal>
            <h2 className="text-3xl font-bold text-brand-blue mb-4">
              {t('ctaTitle', 'Ready to Apply?')}
            </h2>
            <p className="text-gray-700 mb-8 max-w-2xl mx-auto">
              {t(
                'ctaDescription',
                'Visit the Seva Sindhu Portal to explore all schemes and submit your application. Support is available for the entire process.'
              )}
            </p>
          </Reveal>

          <Reveal className="flex flex-col sm:flex-row gap-4 justify-center" delay={0.12}>
            <a href="https://sevasindhu.karnataka.gov.in" target="_blank" rel="noopener noreferrer">
              <Button variant="secondary" size="lg" className="pulse-glow">
                View All Schemes on Seva Sindhu
              </Button>
            </a>
            <Link href={`/${locale}/contact`}>
              <Button variant="outline" size="lg" className="border-brand-blue text-brand-blue hover:bg-brand-blue hover:text-white">
                Need Help? Contact Us
              </Button>
            </Link>
          </Reveal>
        </div>
      </section>

      {/* Info Section */}
      <section className="section bg-white border-t">
        <div className="container-page">
          <div className="grid md:grid-cols-3 gap-8">
            <Reveal>
              <div className="text-center">
                <div className="text-4xl mb-4">📋</div>
                <h3 className="font-semibold text-brand-blue mb-2">
                  {t('infoSteps', 'Simple Application')}
                </h3>
                <p className="text-gray-700 text-sm">
                  Easy online application process through official portals with step-by-step guidance.
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="text-center">
                <div className="text-4xl mb-4">⚡</div>
                <h3 className="font-semibold text-brand-blue mb-2">
                  {t('infoFast', 'Quick Processing')}
                </h3>
                <p className="text-gray-700 text-sm">
                  Fast verification and approval process with direct benefit transfer to your account.
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="text-center">
                <div className="text-4xl mb-4">🛡️</div>
                <h3 className="font-semibold text-brand-blue mb-2">
                  {t('infoSecure', 'Secure Process')}
                </h3>
                <p className="text-gray-700 text-sm">
                  Your data is handled securely through official government channels with complete privacy.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
