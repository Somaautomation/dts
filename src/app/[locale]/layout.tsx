import type { Metadata, Viewport } from 'next';
import { Inter, Poppins, Noto_Sans_Kannada } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Toaster } from 'sonner';

import { locales } from '@/i18n/request';
import { SiteHeader } from '@/components/layout/site-header';
import { SiteFooter } from '@/components/layout/site-footer';
import { ChatWidget } from '@/components/chatbot/chat-widget';
import { AuthProvider } from '@/components/providers/auth-provider';
import { WhatsAppFloat } from '@/components/whatsapp/whatsapp-float';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const poppins = Poppins({ subsets: ['latin'], weight: ['400', '600', '700', '800'], variable: '--font-poppins', display: 'swap' });
const notoKannada = Noto_Sans_Kannada({ subsets: ['kannada'], weight: ['400', '500', '700'], variable: '--font-noto-kannada', display: 'swap' });

export const metadata: Metadata = {
  title: {
    default: 'D.T. Srinivas Connect — Official Platform',
    template: '%s | D.T. Srinivas Connect',
  },
  description:
    'Official platform of D.T. Srinivas — MLC, South East Teachers Constituency. Membership, grievance redressal, events, and citizen engagement.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? 'https://www.dtsrinivas.com'),
  manifest: '/manifest.json',
  appleWebApp: { capable: true, statusBarStyle: 'black-translucent', title: 'DTS Connect' },
  openGraph: {
    type: 'website',
    siteName: 'D.T. Srinivas Connect',
    title: 'D.T. Srinivas Connect — Official Platform',
    description: 'Education • Empowerment • Equality • Service',
    images: ['/og-image.jpg'],
  },
  twitter: { card: 'summary_large_image' },
  icons: { icon: '/favicon.ico', apple: '/icons/apple-touch-icon.png' },
};

export const viewport: Viewport = {
  themeColor: '#003366',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (!locales.includes(locale as any)) notFound();
  const messages = await getMessages();

  return (
    <div className={`${inter.variable} ${poppins.variable} ${notoKannada.variable} ${locale === 'kn' ? 'font-kannada' : 'font-sans'} flex min-h-screen flex-col`}>
      <AuthProvider>
        <NextIntlClientProvider messages={messages}>
          <SiteHeader locale={locale} />
          <main className="flex-1">{children}</main>
          <SiteFooter />
          <ChatWidget />
          <WhatsAppFloat />
          <Toaster position="top-right" richColors />
        </NextIntlClientProvider>
      </AuthProvider>
    </div>
  );
}
