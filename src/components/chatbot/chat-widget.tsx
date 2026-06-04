'use client';

import { useState, useRef, useEffect } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { MessageCircle, X, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type Msg = { role: 'user' | 'assistant'; content: string };

export function ChatWidget() {
  const locale = useLocale();
  const t = useTranslations('chat');
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    { role: 'assistant', content: locale === 'kn' ? 'ನಮಸ್ಕಾರ! ನಾನು ಡಿ.ಟಿ. ಶ್ರೀನಿವಾಸ್ ಕಚೇರಿಯ ಸಹಾಯಕ. ನಾನು ಹೇಗೆ ಸಹಾಯ ಮಾಡಬಹುದು?' : "Namaste! I'm the D.T. Srinivas office assistant. How can I help you today?" },
  ]);
  const [input, setInput] = useState('');
  const [sessionId, setSessionId] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setMessages((m) => [...m, { role: 'user', content: userMsg }]);
    setInput('');
    setLoading(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg, language: locale, sessionId }),
      });
      const data = await res.json();
      if (data.sessionId) setSessionId(data.sessionId);
      setMessages((m) => [...m, { role: 'assistant', content: data.reply ?? 'Sorry, please try again.' }]);
    } catch {
      setMessages((m) => [...m, { role: 'assistant', content: 'Network issue. Please retry.' }]);
    } finally { setLoading(false); }
  };

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          'fixed bottom-5 right-5 z-50 grid h-14 w-14 place-items-center rounded-full shadow-2xl text-white transition-transform hover:scale-110',
          'gradient-brand'
        )}
        aria-label="Open chat"
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>

      {open && (
        <div className="fixed bottom-24 right-5 z-50 w-[calc(100vw-2.5rem)] sm:w-96 h-[32rem] bg-white rounded-2xl shadow-2xl border flex flex-col overflow-hidden animate-slide-up">
          <header className="gradient-brand text-white p-4">
            <div className="font-bold">{t('title')}</div>
            <div className="text-xs text-white/80">{t('disclaimer')}</div>
          </header>
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-brand-gray/40">
            {messages.map((m, i) => (
              <div key={i} className={cn('flex', m.role === 'user' ? 'justify-end' : 'justify-start')}>
                <div className={cn(
                  'max-w-[80%] rounded-2xl px-4 py-2 text-sm',
                  m.role === 'user' ? 'bg-brand-blue text-white rounded-br-sm' : 'bg-white border rounded-bl-sm'
                )}>{m.content}</div>
              </div>
            ))}
            {loading && <div className="text-sm text-muted-foreground">...</div>}
          </div>
          <div className="border-t p-3 flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && send()}
              placeholder={t('placeholder')}
              className="flex-1 h-10 rounded-md border px-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue"
            />
            <Button size="icon" onClick={send} disabled={loading}><Send className="h-4 w-4" /></Button>
          </div>
        </div>
      )}
    </>
  );
}
