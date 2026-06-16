'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useSession, signOut } from 'next-auth/react';
import {
  Menu, X, Globe, User, ChevronDown,
  Info, Trophy, Heart, BookOpen, FileText,
  CalendarDays, Newspaper, HandHelping, Phone,
  ShieldCheck, LayoutDashboard, LogOut, UserCircle,
  ArrowRight,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// ── Nav structure with dropdown groups ─────────────────────────────────────
const navGroups = [
  { key: 'home', href: '', icon: null, children: [] },
  {
    key: 'about',
    href: '/about',
    icon: Info,
    children: [
      { key: 'about', href: '/about', icon: Info, desc: 'Biography & journey of D.T. Srinivas' },
      { key: 'achievements', href: '/achievements', icon: Trophy, desc: 'Legislative & community milestones' },
      { key: 'welfare', href: '/welfare-schemes', icon: Heart, desc: 'Karnataka government welfare schemes' },
    ],
  },
  {
    key: 'teachers',
    href: '/teachers',
    icon: BookOpen,
    children: [
      { key: 'teachers', href: '/teachers', icon: BookOpen, desc: 'South East Teachers portal & services' },
      { key: 'grievances', href: '/grievances', icon: FileText, desc: 'Submit & track public grievances' },
    ],
  },
  {
    key: 'events',
    href: '/events',
    icon: CalendarDays,
    children: [
      { key: 'events', href: '/events', icon: CalendarDays, desc: 'Upcoming campaigns & programmes' },
      { key: 'news', href: '/news', icon: Newspaper, desc: 'Press releases & media updates' },
    ],
  },
  { key: 'volunteer', href: '/volunteer', icon: HandHelping, children: [] },
  { key: 'contact', href: '/contact', icon: Phone, children: [] },
] as const;

type NavGroup = (typeof navGroups)[number];
type ChildItem = { key: string; href: string; icon: React.ElementType; desc: string };

// ── Dropdown panel ──────────────────────────────────────────────────────────
function DropdownMenu({ group, locale, pathname, onClose }: {
  group: NavGroup & { children: ChildItem[] };
  locale: string;
  pathname: string;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 8, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 6, scale: 0.97 }}
        transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
        className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-72 rounded-2xl border border-brand-blue/10 bg-white shadow-2xl shadow-brand-blue/10 overflow-hidden z-50"
      >
        {/* top accent */}
        <div className="h-1 w-full bg-gradient-to-r from-brand-blue via-brand-saffron to-brand-green" />
        <div className="p-2">
          {group.children.map((child, i) => {
            const href = `/${locale}${child.href}`;
            const active = pathname === href || pathname.startsWith(href + '/');
            const Icon = child.icon;
            return (
              <Link
                key={child.key}
                href={href}
                onClick={onClose}
                className={cn(
                  'flex items-start gap-3 rounded-xl p-3 transition-all group',
                  active ? 'bg-brand-blue/5' : 'hover:bg-brand-gray'
                )}
              >
                <span className={cn(
                  'mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg transition-colors',
                  active ? 'bg-brand-blue text-white' : 'bg-brand-gray text-brand-blue group-hover:bg-brand-blue group-hover:text-white'
                )}>
                  <Icon className="h-4 w-4" />
                </span>
                <span>
                  <span className="block text-sm font-semibold text-brand-blue leading-tight">
                    {child.key === 'welfare' ? 'Welfare Schemes' :
                      child.key === 'achievements' ? 'Achievements' :
                        child.key === 'teachers' ? 'Teachers Portal' :
                          child.key === 'grievances' ? 'Grievances' :
                            child.key === 'events' ? 'Events' :
                              child.key === 'news' ? 'News & Media' :
                                child.key.charAt(0).toUpperCase() + child.key.slice(1)}
                  </span>
                  <span className="mt-0.5 block text-xs text-gray-500 leading-snug">{child.desc}</span>
                </span>
                <ArrowRight className="ml-auto mt-2 h-3.5 w-3.5 flex-shrink-0 text-gray-300 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
              </Link>
            );
          })}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

// ── Breadcrumb ──────────────────────────────────────────────────────────────
function Breadcrumb({ locale, pathname }: { locale: string; pathname: string }) {
  const segments = pathname.replace(`/${locale}`, '').split('/').filter(Boolean);
  if (segments.length === 0) return null;

  const labelMap: Record<string, string> = {
    'about': 'About',
    'achievements': 'Achievements',
    'welfare-schemes': 'Welfare Schemes',
    'teachers': 'Teachers',
    'grievances': 'Grievances',
    'events': 'Events',
    'news': 'News',
    'volunteer': 'Volunteer',
    'contact': 'Contact',
    'membership': 'Membership',
    'join': 'Join',
    'card': 'Card',
    'auth': 'Auth',
    'login': 'Login',
    'dashboard': 'Dashboard',
    'admin': 'Admin',
    'appointments': 'Appointments',
    'book': 'Book',
    'register': 'Register',
    'new': 'New',
    'track': 'Track',
  };

  const crumbs = [
    { label: 'Home', href: `/${locale}` },
    ...segments.map((seg, i) => ({
      label: labelMap[seg] ?? seg.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
      href: `/${locale}/${segments.slice(0, i + 1).join('/')}`,
    })),
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      className="border-b border-brand-gray bg-brand-gray/40 px-4"
    >
      <div className="container-page flex items-center gap-1.5 h-8 text-xs text-gray-500 overflow-x-auto scrollbar-hide whitespace-nowrap">
        {crumbs.map((crumb, i) => (
          <span key={crumb.href} className="flex items-center gap-1.5">
            {i > 0 && <span className="text-gray-300">/</span>}
            {i === crumbs.length - 1 ? (
              <span className="font-semibold text-brand-blue">{crumb.label}</span>
            ) : (
              <Link href={crumb.href} className="hover:text-brand-blue transition-colors">
                {crumb.label}
              </Link>
            )}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

// ── Main Header ─────────────────────────────────────────────────────────────
export function SiteHeader({ locale }: { locale: string }) {
  const t = useTranslations('nav');
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const otherLocale = locale === 'en' ? 'kn' : 'en';
  const switchHref = pathname.replace(`/${locale}`, `/${otherLocale}`);
  const showBreadcrumb = pathname !== `/${locale}` && pathname !== `/${locale}/`;

  function handleMouseEnter(key: string) {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setActiveDropdown(key);
  }
  function handleMouseLeave() {
    closeTimer.current = setTimeout(() => setActiveDropdown(null), 120);
  }

  useEffect(() => () => { if (closeTimer.current) clearTimeout(closeTimer.current); }, []);

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 shadow-sm">
      {/* ── Main bar ── */}
      <div className="border-b border-brand-gray/60">
        <div className="container-page flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center gap-3 flex-shrink-0">
            <div className="grid h-10 w-10 place-items-center rounded-full gradient-brand text-white font-display font-extrabold shadow-lg">DT</div>
            <div className="hidden sm:block">
              <div className="text-base md:text-lg font-extrabold leading-tight tracking-tight bg-gradient-to-r from-brand-blue via-brand-blue-light to-brand-green bg-clip-text text-transparent">
                D.T. Srinivas
              </div>
              <div className="mt-0.5 inline-flex rounded-full border border-brand-saffron/45 bg-gradient-to-r from-brand-saffron/25 to-brand-green/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em] text-brand-blue">
                MLC • South East Teachers
              </div>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-0.5">
            {navGroups.map((group) => {
              const href = `/${locale}${group.href}`;
              const active = pathname === href || (group.href && pathname.startsWith(href));
              const hasChildren = group.children.length > 0;
              const isOpen = activeDropdown === group.key;

              return (
                <div
                  key={group.key}
                  className="relative"
                  onMouseEnter={() => hasChildren && handleMouseEnter(group.key)}
                  onMouseLeave={handleMouseLeave}
                >
                  <Link
                    href={href}
                    className={cn(
                      'flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-lg transition-all',
                      active
                        ? 'text-brand-blue bg-brand-blue/8 font-semibold'
                        : 'text-gray-700 hover:text-brand-blue hover:bg-brand-gray'
                    )}
                  >
                    {t(group.key)}
                    {hasChildren && (
                      <ChevronDown className={cn('h-3.5 w-3.5 transition-transform duration-200', isOpen && 'rotate-180')} />
                    )}
                  </Link>
                  {hasChildren && isOpen && (
                    <DropdownMenu
                      group={group as NavGroup & { children: ChildItem[] }}
                      locale={locale}
                      pathname={pathname}
                      onClose={() => setActiveDropdown(null)}
                    />
                  )}
                </div>
              );
            })}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <Link
              href={switchHref}
              className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold border border-brand-blue/20 text-brand-blue hover:bg-brand-blue hover:text-white rounded-lg transition-all"
            >
              <Globe className="h-3.5 w-3.5" />
              {otherLocale === 'kn' ? 'ಕನ್ನಡ' : 'EN'}
            </Link>

            {status === 'authenticated' ? (
              <div className="hidden sm:flex items-center gap-2">
                <Link href={`/${locale}/dashboard`}>
                  <Button variant="ghost" size="sm" className="gap-1.5">
                    <UserCircle className="h-4 w-4" />
                    {session.user?.name?.split(' ')[0]}
                  </Button>
                </Link>
                <Button variant="outline" size="sm" onClick={() => signOut({ callbackUrl: `/${locale}` })} className="gap-1.5">
                  <LogOut className="h-3.5 w-3.5" />
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

            <button className="lg:hidden p-2 rounded-lg hover:bg-brand-gray transition-colors" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* ── Breadcrumb ── */}
      {showBreadcrumb && <Breadcrumb locale={locale} pathname={pathname} />}

      {/* ── Mobile menu ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="lg:hidden border-t bg-white overflow-hidden"
          >
            <nav className="container-page flex flex-col py-3 gap-0.5">
              {navGroups.map((group) => {
                const href = `/${locale}${group.href}`;
                const active = pathname === href || (group.href && pathname.startsWith(href));
                const hasChildren = group.children.length > 0;
                const expanded = mobileExpanded === group.key;

                return (
                  <div key={group.key}>
                    <div className="flex items-center gap-1">
                      <Link
                        href={href}
                        onClick={() => { if (!hasChildren) setMobileOpen(false); }}
                        className={cn(
                          'flex-1 flex items-center px-3 py-2.5 rounded-xl text-sm font-medium transition-colors',
                          active ? 'bg-brand-blue/8 text-brand-blue font-semibold' : 'text-gray-700 hover:bg-brand-gray hover:text-brand-blue'
                        )}
                      >
                        {t(group.key)}
                      </Link>
                      {hasChildren && (
                        <button
                          onClick={() => setMobileExpanded(expanded ? null : group.key)}
                          className="p-2 rounded-lg hover:bg-brand-gray transition-colors"
                        >
                          <ChevronDown className={cn('h-4 w-4 text-brand-blue transition-transform', expanded && 'rotate-180')} />
                        </button>
                      )}
                    </div>

                    <AnimatePresence>
                      {hasChildren && expanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="ml-4 mt-0.5 mb-1 border-l-2 border-brand-blue/20 pl-3 flex flex-col gap-0.5 overflow-hidden"
                        >
                          {(group.children as unknown as ChildItem[]).map((child) => {
                            const childHref = `/${locale}${child.href}`;
                            const childActive = pathname === childHref;
                            const Icon = child.icon;
                            return (
                              <Link
                                key={child.key}
                                href={childHref}
                                onClick={() => setMobileOpen(false)}
                                className={cn(
                                  'flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors',
                                  childActive ? 'bg-brand-blue/8 text-brand-blue font-semibold' : 'text-gray-600 hover:bg-brand-gray hover:text-brand-blue'
                                )}
                              >
                                <Icon className="h-4 w-4 flex-shrink-0 text-brand-blue/60" />
                                <span>
                                  {child.key === 'welfare' ? 'Welfare Schemes' :
                                    child.key.charAt(0).toUpperCase() + child.key.slice(1).replace(/-/g, ' ')}
                                </span>
                              </Link>
                            );
                          })}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}

              <div className="border-t mt-2 pt-3 flex flex-col gap-2">
                <Link href={switchHref} onClick={() => setMobileOpen(false)} className="flex items-center gap-2 px-3 py-2 text-sm text-brand-blue font-medium">
                  <Globe className="h-4 w-4" />
                  {otherLocale === 'kn' ? 'Switch to ಕನ್ನಡ' : 'Switch to English'}
                </Link>
                {status === 'authenticated' ? (
                  <>
                    <Link href={`/${locale}/dashboard`} onClick={() => setMobileOpen(false)}>
                      <Button className="w-full gap-2" variant="outline"><LayoutDashboard className="h-4 w-4" />{t('dashboard')}</Button>
                    </Link>
                    <Button className="w-full gap-2" variant="ghost" onClick={() => signOut({ callbackUrl: `/${locale}` })}>
                      <LogOut className="h-4 w-4" />{t('logout')}
                    </Button>
                  </>
                ) : (
                  <>
                    <Link href={`/${locale}/auth/login`} onClick={() => setMobileOpen(false)}>
                      <Button className="w-full" variant="outline">{t('login')}</Button>
                    </Link>
                    <Link href={`/${locale}/membership/join`} onClick={() => setMobileOpen(false)}>
                      <Button className="w-full" variant="accent">{t('signup')}</Button>
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}


const navItems = [
  { key: 'home', href: '' },
  { key: 'about', href: '/about' },
  { key: 'achievements', href: '/achievements' },
  { key: 'welfare', href: '/welfare-schemes' },
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
