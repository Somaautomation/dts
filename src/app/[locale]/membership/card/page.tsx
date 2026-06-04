'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Download, Share2 } from 'lucide-react';

export default function MembershipCard({ params: { locale } }: { params: { locale: string } }) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const cardRef = useRef<HTMLDivElement>(null);
  const [m, setM] = useState<any>(null);

  useEffect(() => {
    if (status === 'unauthenticated') router.replace(`/${locale}/auth/login?next=/membership/card`);
    if (status === 'authenticated') {
      fetch('/api/membership/me').then((r) => r.json()).then(setM);
    }
  }, [status, router, locale]);

  const downloadPdf = async () => {
    if (!cardRef.current) return;
    const canvas = await html2canvas(cardRef.current, { scale: 3, backgroundColor: null });
    const img = canvas.toDataURL('image/png');
    const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: [85.6, 54] });
    pdf.addImage(img, 'PNG', 0, 0, 85.6, 54);
    pdf.save(`DTSC-Membership-${m?.membershipId}.pdf`);
  };

  const share = async () => {
    if (navigator.share) {
      await navigator.share({ title: 'My DTSC Membership', text: `I'm a member of D.T. Srinivas Connect — ID ${m?.membershipId}`, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  if (!m) return <div className="section text-center">Loading…</div>;

  return (
    <section className="section bg-brand-gray min-h-[calc(100vh-4rem)]">
      <div className="container-page max-w-2xl text-center">
        <h1 className="text-3xl font-bold text-brand-blue mb-6">Your Digital Membership Card</h1>

        <div className="flex justify-center">
          <div ref={cardRef} className="w-[400px] h-[250px] rounded-xl overflow-hidden shadow-2xl text-white relative gradient-brand p-5 text-left">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,153,51,0.3),transparent_60%)]" />
            <div className="relative flex justify-between items-start">
              <div>
                <div className="text-[10px] uppercase tracking-widest text-white/80">D.T. Srinivas Connect</div>
                <div className="text-sm font-semibold">Member Identity Card</div>
              </div>
              <div className="h-10 w-10 grid place-items-center rounded-full bg-white text-brand-blue font-bold">DT</div>
            </div>
            <div className="relative mt-6 flex justify-between items-end">
              <div>
                <div className="text-xs text-white/70">Name</div>
                <div className="font-bold">{session?.user?.name}</div>
                <div className="text-xs text-white/70 mt-2">Member ID</div>
                <div className="font-mono font-bold">{m.membershipId}</div>
                <div className="text-[10px] mt-1 text-white/70">{m.type.replace('_', ' ')}</div>
              </div>
              {m.qrCode && <img src={m.qrCode} alt="QR" className="h-20 w-20 bg-white rounded" />}
            </div>
            <div className="absolute bottom-2 left-5 right-5 flex justify-between text-[9px] text-white/70">
              <span>Issued: {new Date(m.joinedAt).toLocaleDateString()}</span>
              <span>Valid till: {m.validTo ? new Date(m.validTo).toLocaleDateString() : '—'}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-3 justify-center mt-6">
          <Button onClick={downloadPdf} variant="accent"><Download className="h-4 w-4" /> Download PDF</Button>
          <Button onClick={share} variant="outline"><Share2 className="h-4 w-4" /> Share</Button>
        </div>
      </div>
    </section>
  );
}
