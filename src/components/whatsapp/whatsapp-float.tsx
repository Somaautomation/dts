'use client';

import { MessageCircle } from 'lucide-react';

function normalizeIndianPhone(raw?: string) {
  if (!raw) return '';
  const digits = raw.replace(/\D/g, '');
  if (!digits) return '';
  if (digits.startsWith('91')) return digits;
  return `91${digits}`;
}

export function WhatsAppFloat() {
  const phone = normalizeIndianPhone(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER);
  if (!phone) return null;

  const text =
    process.env.NEXT_PUBLIC_WHATSAPP_MESSAGE ??
    'Namaskara, I would like to connect with D.T. Srinivas office.';
  const href = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed left-4 bottom-4 z-50 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-3 text-white shadow-xl transition hover:brightness-95"
    >
      <MessageCircle className="h-5 w-5" />
      <span className="hidden sm:inline text-sm font-semibold">WhatsApp</span>
    </a>
  );
}
