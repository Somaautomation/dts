import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default async function Dashboard({ params: { locale } }: { params: { locale: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect(`/${locale}/auth/login?next=/dashboard`);
  const userId = (session.user as any).id as string;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      membership: true,
      volunteer: { include: { tasks: { orderBy: { createdAt: 'desc' }, take: 5 } } },
      teacher: true,
      grievances: { orderBy: { createdAt: 'desc' }, take: 5 },
      eventRegs: { include: { event: true }, orderBy: { registeredAt: 'desc' }, take: 5 },
      notifications: { where: { read: false }, take: 10 },
    },
  });
  if (!user) redirect(`/${locale}/auth/login`);

  return (
    <section className="section bg-brand-gray min-h-[calc(100vh-4rem)]">
      <div className="container-page space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold text-brand-blue">Namaste, {user.name.split(' ')[0]}</h1>
            <p className="text-muted-foreground">{user.district}{user.taluk ? ` · ${user.taluk}` : ''}</p>
          </div>
          <Badge variant="primary">{user.role}</Badge>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {user.membership && (
            <Card>
              <CardHeader>
                <CardTitle>Membership</CardTitle>
                <CardDescription>{user.membership.type.replace('_', ' ')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="font-mono font-bold text-brand-blue">{user.membership.membershipId}</div>
                <Badge variant={user.membership.status === 'ACTIVE' ? 'success' : 'warning'} className="mt-2">{user.membership.status}</Badge>
                <Link href={`/${locale}/membership/card`} className="block mt-4"><Button variant="outline" className="w-full">View Card</Button></Link>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader><CardTitle>My Grievances</CardTitle></CardHeader>
            <CardContent>
              {user.grievances.length === 0 ? (
                <p className="text-sm text-muted-foreground">No grievances yet.</p>
              ) : (
                <ul className="space-y-2 text-sm">
                  {user.grievances.map((g) => (
                    <li key={g.id} className="flex justify-between items-center">
                      <span className="truncate">{g.subject}</span>
                      <Badge variant="info">{g.status}</Badge>
                    </li>
                  ))}
                </ul>
              )}
              <Link href={`/${locale}/grievances/new`} className="block mt-4"><Button variant="accent" size="sm" className="w-full">New Grievance</Button></Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Event Registrations</CardTitle></CardHeader>
            <CardContent>
              {user.eventRegs.length === 0 ? (
                <p className="text-sm text-muted-foreground">No upcoming events registered.</p>
              ) : (
                <ul className="space-y-2 text-sm">
                  {user.eventRegs.map((r) => (
                    <li key={r.id} className="flex justify-between">
                      <span className="truncate">{r.event.title}</span>
                      <Badge variant="default">{new Date(r.event.startsAt).toLocaleDateString('en-IN')}</Badge>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>

        {user.volunteer && (
          <Card>
            <CardHeader>
              <CardTitle>Volunteer Tasks</CardTitle>
              <CardDescription>Completed: {user.volunteer.completedTasks} / {user.volunteer.totalTasks}</CardDescription>
            </CardHeader>
            <CardContent>
              {user.volunteer.tasks.length === 0 ? (
                <p className="text-sm text-muted-foreground">No assigned tasks yet.</p>
              ) : (
                <ul className="divide-y">
                  {user.volunteer.tasks.map((t) => (
                    <li key={t.id} className="py-2 flex justify-between items-center">
                      <div>
                        <div className="font-semibold">{t.title}</div>
                        <div className="text-xs text-muted-foreground">{t.category}</div>
                      </div>
                      <Badge variant={t.status === 'COMPLETED' ? 'success' : 'warning'}>{t.status}</Badge>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  );
}
