"use client";

import { useTranslations } from 'next-intl';
import { Bell } from 'lucide-react';

export function NotificationBanner() {
  const t = useTranslations('banner');

  const items = [
    t('message1'),
    t('message2'),
    t('message3'),
  ];

  return (
    <div className="relative overflow-hidden border-b border-brand-saffron/30 bg-brand-blue text-white">
      <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-brand-blue to-transparent" />
      <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-brand-blue to-transparent" />

      <div className="flex items-center gap-3 px-4 py-2">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-saffron text-brand-blue">
          <Bell className="h-4 w-4" />
        </div>

        <div className="overflow-hidden flex-1">
          <div className="notification-marquee flex min-w-max items-center gap-6 whitespace-nowrap">
            {[...items, ...items].map((item, index) => (
              <span key={`${item}-${index}`} className="inline-flex items-center gap-2 text-sm font-medium tracking-wide">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-saffron" />
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}