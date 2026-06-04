'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useSession, signOut } from 'next-auth/react';
import { Menu, X, Globe, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const navItems = [
  { key: 'home', href: '' },
  { key: 'about', href: '/about' },
  { key: 'achievements', href: '/achievements' },
  { key: 'teachers', href: '/teachers' },
  { key: 'grievances', href: '/grievances' },
  { key: 'events', href: '/events' },
  { key: 'news', href: '/news' },
  { key: 'volunteer', href: '/volunteer' },
  { key: 'contact', href: '/contact' },
] as const;

export function SiteHeader({ locale }: { locale: string }) {
  const t = useTranslations('nav');
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);

  const otherLocale = locale === 'en' ? 'kn' : 'en';
  const switchHref = pathname.replace(`/${locale}`, `/${otherLocale}`);

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 shadow-sm">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Link href={`/${locale}`} className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-full gradient-brand text-white font-display font-extrabold shadow-lg">DT</div>
          <div className="hidden sm:block">
            <div className="text-base md:text-lg font-extrabold leading-tight tracking-tight bg-gradient-to-r from-brand-blue via-brand-blue-light to-brand-green bg-clip-text text-transparent drop-shadow-[0_1px_0_rgba(255,255,255,0.65)]">
              D.T. Srinivas
            </div>
            <div className="mt-0.5 inline-flex rounded-full border border-brand-saffron/45 bg-gradient-to-r from-brand-saffron/25 to-brand-green/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em] text-brand-blue">
              MLC • South East Teachers
            </div>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => {
            const href = `/${locale}${item.href}`;
            const active = pathname === href || (item.href && pathname.startsWith(href));
            return (
              <Link
                key={item.key}
                href={href}
                className={cn(
                  'px-3 py-2 text-sm font-medium rounded-md transition-colors',
                  active ? 'text-brand-blue bg-brand-blue/5' : 'text-gray-700 hover:text-brand-blue hover:bg-brand-gray'
                )}
              >
                {t(item.key)}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href={switchHref}
            className="hidden sm:inline-flex items-center gap-1 px-3 py-2 text-sm font-medium text-brand-blue hover:bg-brand-gray rounded-md"
            aria-label="Switch language"
          >
            <Globe className="h-4 w-4" />
            {otherLocale === 'kn' ? 'ಕನ್ನಡ' : 'EN'}
          </Link>

          {status === 'authenticated' ? (
            <div className="hidden sm:flex items-center gap-2">
              <Link href={`/${locale}/dashboard`}>
                <Button variant="ghost" size="sm">
                  <User className="h-4 w-4" />
                  {session.user?.name?.split(' ')[0]}
                </Button>
              </Link>
              <Button variant="outline" size="sm" onClick={() => signOut({ callbackUrl: `/${locale}` })}>
                {t('logout')}
              </Button>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Link href={`/${locale}/auth/login`}>
                <Button variant="outline" size="sm">{t('login')}</Button>
              </Link>
              <Link href={`/${locale}/membership/join`}>
                <Button variant="accent" size="sm">{t('signup')}</Button>
              </Link>
            </div>
          )}

          <button className="lg:hidden p-2" onClick={() => setOpen(!open)} aria-label="Menu">
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden border-t bg-white">
          <nav className="container-page flex flex-col py-4 gap-1">
            {navItems.map((item) => (
              <Link key={item.key} href={`/${locale}${item.href}`} onClick={() => setOpen(false)} className="px-3 py-2.5 rounded-md hover:bg-brand-gray text-brand-blue font-medium">
                {t(item.key)}
              </Link>
            ))}
            <div className="border-t mt-2 pt-2 flex flex-col gap-2">
              <Link href={switchHref} onClick={() => setOpen(false)} className="px-3 py-2 text-brand-blue">
                {otherLocale === 'kn' ? 'ಕನ್ನಡ' : 'English'}
              </Link>
              {status === 'authenticated' ? (
                <>
                  <Link href={`/${locale}/dashboard`} onClick={() => setOpen(false)}>
                    <Button className="w-full" variant="outline">{t('dashboard')}</Button>
                  </Link>
                  <Button className="w-full" variant="ghost" onClick={() => signOut({ callbackUrl: `/${locale}` })}>{t('logout')}</Button>
                </>
              ) : (
                <>
                  <Link href={`/${locale}/auth/login`} onClick={() => setOpen(false)}>
                    <Button className="w-full" variant="outline">{t('login')}</Button>
                  </Link>
                  <Link href={`/${locale}/membership/join`} onClick={() => setOpen(false)}>
                    <Button className="w-full" variant="accent">{t('signup')}</Button>
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
