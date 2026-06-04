import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin } from 'lucide-react';

export function SiteFooter() {
  const t = useTranslations('footer');
  const tNav = useTranslations('nav');
  const locale = useLocale();
  const waDigits = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '').replace(/\D/g, '');
  const waPhone = waDigits ? (waDigits.startsWith('91') ? waDigits : `91${waDigits}`) : '';
  const waMessage =
    process.env.NEXT_PUBLIC_WHATSAPP_MESSAGE ??
    'Namaskara, I would like to connect with D.T. Srinivas office.';
  const waUrl = waPhone ? `https://wa.me/${waPhone}?text=${encodeURIComponent(waMessage)}` : '';

  return (
    <footer className="bg-brand-blue text-white mt-16">
      <div className="container-page py-12 grid gap-10 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div className="grid h-12 w-12 place-items-center rounded-full bg-white text-brand-blue font-display font-bold">DT</div>
            <div>
              <div className="font-bold">D.T. Srinivas</div>
              <div className="text-xs text-white/70">MLC, Karnataka</div>
            </div>
          </div>
          <p className="text-sm text-white/80 leading-relaxed">
            Education • Empowerment • Equality • Service
          </p>
        </div>

        <div>
          <h4 className="font-semibold mb-3 text-brand-saffron">{t('quickLinks')}</h4>
          <ul className="space-y-2 text-sm text-white/80">
            <li><Link href={`/${locale}/about`} className="hover:text-white">{tNav('about')}</Link></li>
            <li><Link href={`/${locale}/achievements`} className="hover:text-white">{tNav('achievements')}</Link></li>
            <li><Link href={`/${locale}/membership/join`} className="hover:text-white">{tNav('membership')}</Link></li>
            <li><Link href={`/${locale}/grievances/new`} className="hover:text-white">{tNav('grievances')}</Link></li>
            <li><Link href={`/${locale}/events`} className="hover:text-white">{tNav('events')}</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-3 text-brand-saffron">{t('contact')}</h4>
          <ul className="space-y-2 text-sm text-white/80">
            <li className="flex gap-2"><MapPin className="h-4 w-4 mt-0.5 shrink-0" />Vidhana Soudha, Bengaluru — 560001</li>
            <li className="flex gap-2"><Phone className="h-4 w-4 mt-0.5 shrink-0" />+91-80-XXXXXXXX</li>
            <li className="flex gap-2"><Mail className="h-4 w-4 mt-0.5 shrink-0" />office@dtsrinivas.com</li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-3 text-brand-saffron">{t('follow')}</h4>
          <div className="flex gap-3">
            <SocialLink href={process.env.NEXT_PUBLIC_FACEBOOK_URL} icon={<Facebook className="h-5 w-5" />} label="Facebook" />
            <SocialLink href={process.env.NEXT_PUBLIC_INSTAGRAM_URL} icon={<Instagram className="h-5 w-5" />} label="Instagram" />
            <SocialLink href={process.env.NEXT_PUBLIC_TWITTER_URL} icon={<Twitter className="h-5 w-5" />} label="Twitter" />
            <SocialLink href={process.env.NEXT_PUBLIC_YOUTUBE_URL} icon={<Youtube className="h-5 w-5" />} label="YouTube" />
            <SocialLink href={waUrl} icon={<Phone className="h-5 w-5" />} label="WhatsApp" />
          </div>
        </div>
      </div>

      <div className="border-t border-white/15">
        <div className="container-page py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-white/70">
          <p>© {new Date().getFullYear()} {t('office')}. {t('rights')}</p>
          <div className="flex gap-4">
            <Link href={`/${locale}/privacy`} className="hover:text-white">{t('privacy')}</Link>
            <Link href={`/${locale}/terms`} className="hover:text-white">{t('terms')}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function SocialLink({ href, icon, label }: { href?: string; icon: React.ReactNode; label: string }) {
  if (!href) return null;
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className="grid h-10 w-10 place-items-center rounded-full bg-white/10 hover:bg-brand-saffron hover:text-brand-blue transition-colors">
      {icon}
    </a>
  );
}
