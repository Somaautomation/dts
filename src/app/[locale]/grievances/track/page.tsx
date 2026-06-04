import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default async function GrievanceTrackPage({ params: { locale } }: { params: { locale: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect(`/${locale}/auth/login?next=/grievances/track`);
  const userId = (session.user as any).id as string;
  const items = await prisma.grievance.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    include: { updates: { orderBy: { createdAt: 'desc' }, take: 3 } },
  });

  return (
    <section className="section bg-brand-gray min-h-[calc(100vh-4rem)]">
      <div className="container-page max-w-3xl space-y-4">
        <h1 className="text-3xl font-bold text-brand-blue">Track Your Grievances</h1>
        {items.length === 0 && <p className="text-muted-foreground">You have no grievances yet.</p>}
        {items.map((g) => (
          <Card key={g.id}>
            <CardHeader>
              <div className="flex justify-between items-center gap-2 flex-wrap">
                <CardTitle>{g.subject}</CardTitle>
                <Badge variant={g.status === 'RESOLVED' ? 'success' : g.status === 'REJECTED' ? 'danger' : 'warning'}>{g.status}</Badge>
              </div>
              <p className="text-xs text-muted-foreground">Ticket {g.ticketId} · {new Date(g.createdAt).toLocaleDateString('en-IN')}</p>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-700 line-clamp-3">{g.description}</p>
              {g.updates.length > 0 && (
                <div className="mt-3 border-t pt-3 space-y-1">
                  {g.updates.map((u) => (
                    <div key={u.id} className="text-xs"><span className="font-semibold">{u.authorName}:</span> {u.message}</div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
