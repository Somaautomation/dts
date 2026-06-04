import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';

export default function ContactPage() {
  const waDigits = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '').replace(/\D/g, '');
  const waPhone = waDigits ? (waDigits.startsWith('91') ? waDigits : `91${waDigits}`) : '';
  const waMessage =
    process.env.NEXT_PUBLIC_WHATSAPP_MESSAGE ??
    'Namaskara, I would like to connect with D.T. Srinivas office.';
  const waUrl = waPhone ? `https://wa.me/${waPhone}?text=${encodeURIComponent(waMessage)}` : '';

  return (
    <>
      <section className="gradient-brand text-white py-16">
        <div className="container-page">
          <h1 className="text-4xl md:text-5xl font-bold">Contact the Office</h1>
          <p className="mt-3 text-white/85 max-w-2xl">Reach out for representation, support, or to schedule a meeting.</p>
        </div>
      </section>

      <section className="section">
        <div className="container-page grid md:grid-cols-2 gap-8">
          <Card>
            <CardHeader><CardTitle>Office Address</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-sm text-gray-700">
              <p className="flex gap-2"><MapPin className="h-5 w-5 text-brand-blue shrink-0" /> Vidhana Soudha, Bengaluru — 560001, Karnataka</p>
              <p className="flex gap-2"><Phone className="h-5 w-5 text-brand-blue shrink-0" /> +91-80-XXXXXXXX</p>
              <p className="flex gap-2"><Mail className="h-5 w-5 text-brand-blue shrink-0" /> office@dtsrinivas.com</p>
              {waUrl && (
                <p className="flex gap-2">
                  <Phone className="h-5 w-5 text-brand-green shrink-0" />
                  <a href={waUrl} target="_blank" rel="noopener noreferrer" className="text-brand-green font-semibold hover:underline">
                    WhatsApp us
                  </a>
                </p>
              )}
              <p className="flex gap-2"><Clock className="h-5 w-5 text-brand-blue shrink-0" /> Monday – Saturday, 10:00 AM – 6:00 PM</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Constituency Office</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-sm text-gray-700">
              <p>For teacher representation and constituency-specific matters, visit any of our regional service centres located across the South East Teachers Constituency.</p>
              <p className="font-semibold text-brand-blue">Helpline (24x7): 1800-XXX-XXXX</p>
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  );
}
