'use client';

import { useRef } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { ArrowRight, Globe, ShieldCheck, Zap, ClipboardList, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SchemeCard } from '@/components/welfare/scheme-card';
import { Reveal } from '@/components/motion/reveal';

export default function WelfareSchemesPage({ params: { locale } }: { params: { locale: string } }) {
  return <WelfareSchemesContent locale={locale} />;
}

function WelfareSchemesContent({ locale }: { locale: string }) {
  const t = useTranslations('welfare');
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useSpring(useTransform(scrollYProgress, [0, 1], [0, 80]), { stiffness: 100, damping: 30 });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

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
      accentColor: 'from-pink-500 to-rose-400',
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
      accentColor: 'from-yellow-400 to-orange-400',
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
      accentColor: 'from-brand-blue to-brand-blue-light',
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
      accentColor: 'from-brand-green to-emerald-400',
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
      accentColor: 'from-violet-500 to-purple-400',
    },
  ];

  const stats = [
    { value: '5', label: 'Active Schemes', icon: '🏛️' },
    { value: '₹2K', label: 'Monthly Support', icon: '💰' },
    { value: '200', label: 'Units Free Power', icon: '⚡' },
    { value: '1Cr+', label: 'Beneficiaries', icon: '👥' },
  ];

  return (
    <>
      {/* ── Hero with parallax ── */}
      <section ref={heroRef} className="relative overflow-hidden gradient-brand text-white min-h-[420px] flex items-center">
        {/* Animated background blobs */}
        <motion.div
          animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/5 blur-3xl pointer-events-none"
        />
        <motion.div
          animate={{ x: [0, -20, 0], y: [0, 30, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -bottom-16 -left-16 w-72 h-72 rounded-full bg-brand-saffron/10 blur-3xl pointer-events-none"
        />

        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="container-page relative z-10 py-20">
          <Reveal>
            <span className="inline-block mb-4 text-xs font-bold uppercase tracking-widest bg-white/10 border border-white/20 rounded-full px-4 py-1.5">
              🏛️ Karnataka Government Initiatives
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
              {t('title')}
            </h1>
            <p className="mt-4 text-white/80 max-w-2xl text-lg leading-relaxed">
              {t('subtitle')}
            </p>
          </Reveal>

          {/* Animated stats row */}
          <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-4 text-center"
              >
                <div className="text-2xl mb-1">{stat.icon}</div>
                <div className="text-2xl font-extrabold">{stat.value}</div>
                <div className="text-xs text-white/70 mt-0.5">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── Scroll indicator ── */}
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: 'easeOut' }}
        className="h-1 bg-gradient-to-r from-brand-blue via-brand-saffron to-brand-green origin-left"
      />

      {/* ── Schemes Section ── */}
      <section className="py-20 bg-gradient-to-b from-white to-brand-gray/30">
        <div className="container-page">
          <Reveal className="text-center mb-14">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-green">All Schemes</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-brand-blue mt-2">
              Benefits Available for You
            </h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto">
              Click <strong>Apply Now</strong> on any card to go directly to the official government portal.
            </p>
          </Reveal>

          {/* Cards grid — staggered scroll entrance */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {schemes.map((scheme, index) => (
              <SchemeCard
                key={scheme.name}
                icon={scheme.icon}
                name={scheme.name}
                description={scheme.description}
                benefits={scheme.benefits}
                eligibility={scheme.eligibility}
                applyLink={scheme.applyLink}
                applyLabel="Apply Now"
                index={index}
                accentColor={scheme.accentColor}
              />
            ))}
          </div>

          {/* Horizontal auto-scroll ticker (mobile-friendly) */}
          <div className="mt-16 overflow-hidden">
            <p className="text-center text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Powered by official portals</p>
            <div className="relative flex gap-6 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide">
              {[...schemes, ...schemes].map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: (i % 5) * 0.06 }}
                  className="snap-start flex-shrink-0 flex items-center gap-2 bg-white rounded-full px-5 py-2.5 border border-brand-blue/10 shadow-sm text-sm font-semibold text-brand-blue"
                >
                  <span>{s.icon}</span>
                  <span>{s.name}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Portals ── */}
      <section className="py-20 bg-brand-blue text-white relative overflow-hidden">
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
          className="absolute -top-32 -right-32 w-96 h-96 rounded-full border border-white/10 pointer-events-none"
        />
        <motion.div
          animate={{ rotate: [360, 0] }}
          transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
          className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full border border-white/10 pointer-events-none"
        />

        <div className="container-page relative z-10">
          <Reveal className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold">{t('portalsTitle')}</h2>
            <p className="mt-3 text-white/70 max-w-xl mx-auto">{t('portalsDescription')}</p>
          </Reveal>

          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {[
              {
                icon: <Globe className="h-8 w-8" />,
                title: 'Seva Sindhu Portal',
                desc: 'Gruha Lakshmi, Gruha Jyothi, Shakti Scheme & Yuva Nidhi',
                link: 'https://sevasindhu.karnataka.gov.in',
                gradient: 'from-brand-saffron/20 to-brand-green/20',
              },
              {
                icon: <ShieldCheck className="h-8 w-8" />,
                title: 'Guarantee Schemes Portal',
                desc: 'Anna Bhagya and other food security schemes',
                link: 'https://sevasindhugs.karnataka.gov.in',
                gradient: 'from-brand-green/20 to-brand-blue-light/20',
              },
            ].map((portal, i) => (
              <motion.div
                key={portal.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.6 }}
                whileHover={{ y: -4, scale: 1.02 }}
                className={`p-7 rounded-2xl bg-gradient-to-br ${portal.gradient} border border-white/15 backdrop-blur`}
              >
                <div className="text-brand-saffron mb-4">{portal.icon}</div>
                <h3 className="text-xl font-bold mb-2">{portal.title}</h3>
                <p className="text-white/70 text-sm mb-5">{portal.desc}</p>
                <a href={portal.link} target="_blank" rel="noopener noreferrer">
                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                    className="flex items-center gap-2 text-sm font-semibold text-white border border-white/30 rounded-xl px-4 py-2 hover:bg-white/10 transition-colors"
                  >
                    Visit Portal <ExternalLink className="h-3.5 w-3.5" />
                  </motion.button>
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="py-20 bg-white">
        <div className="container-page">
          <Reveal className="text-center mb-14">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-green">Simple Process</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-brand-blue mt-2">How to Apply</h2>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { icon: <ClipboardList className="h-8 w-8" />, step: '01', title: t('infoSteps'), desc: 'Easy online application process through official portals with step-by-step guidance.' },
              { icon: <Zap className="h-8 w-8" />, step: '02', title: t('infoFast'), desc: 'Fast verification and approval with direct benefit transfer to your account.' },
              { icon: <ShieldCheck className="h-8 w-8" />, step: '03', title: t('infoSecure'), desc: 'Your data handled securely through official government channels with complete privacy.' },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: i * 0.15, duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
                className="relative text-center"
              >
                {i < 2 && (
                  <motion.div
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.15 + 0.4, duration: 0.5 }}
                    className="hidden md:block absolute top-8 left-[calc(50%+2.5rem)] right-[-50%] h-px bg-gradient-to-r from-brand-blue/30 to-transparent origin-left"
                  />
                )}
                <div className="relative inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-brand-blue/5 border border-brand-blue/10 text-brand-blue mb-4">
                  {item.icon}
                  <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-brand-saffron text-white text-[9px] font-extrabold flex items-center justify-center">
                    {item.step}
                  </span>
                </div>
                <h3 className="font-bold text-brand-blue mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 bg-gradient-to-br from-brand-cream to-brand-gray/40">
        <div className="container-page text-center">
          <Reveal>
            <h2 className="text-3xl md:text-4xl font-extrabold text-brand-blue mb-4">{t('ctaTitle')}</h2>
            <p className="text-gray-600 mb-10 max-w-2xl mx-auto">{t('ctaDescription')}</p>
          </Reveal>
          <Reveal delay={0.15} className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="https://sevasindhu.karnataka.gov.in" target="_blank" rel="noopener noreferrer">
              <Button variant="secondary" size="lg" className="pulse-glow gap-2">
                View All Schemes on Seva Sindhu <ArrowRight className="h-4 w-4" />
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
    </>
  );
}

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
              {t('title')}
            </h1>
            <p className="mt-3 text-white/85 max-w-3xl text-lg">
              {t('subtitle')}
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
              {t('portalsTitle')}
            </h2>
            <p className="text-gray-700 mb-8 max-w-2xl">
              {t('portalsDescription')}
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
              {t('ctaTitle')}
            </h2>
            <p className="text-gray-700 mb-8 max-w-2xl mx-auto">
              {t('ctaDescription')}
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
                  {t('infoSteps')}
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
                  {t('infoFast')}
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
                  {t('infoSecure')}
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
