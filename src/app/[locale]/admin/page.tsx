import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AnalyticsCharts } from '@/components/admin/analytics-charts';

const ADMIN_ROLES = ['ADMIN', 'SUPER_ADMIN', 'MODERATOR', 'OFFICE_STAFF'];

export default async function AdminDashboard({ params: { locale } }: { params: { locale: string } }) {
  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role;
  if (!session || !ADMIN_ROLES.includes(role)) redirect(`/${locale}/auth/login`);

  const [
    totalMembers, totalVolunteers, totalTeachers,
    openGrievances, resolvedGrievances, totalEvents,
    grievancesByCategory, membersByDistrict, weeklySignups,
  ] = await Promise.all([
    prisma.membership.count(),
    prisma.volunteer.count(),
    prisma.teacher.count(),
    prisma.grievance.count({ where: { status: { in: ['SUBMITTED', 'UNDER_REVIEW', 'ASSIGNED', 'IN_PROGRESS'] } } }),
    prisma.grievance.count({ where: { status: { in: ['RESOLVED', 'CLOSED'] } } }),
    prisma.event.count(),
    prisma.grievance.groupBy({ by: ['category'], _count: { _all: true } }),
    prisma.user.groupBy({ by: ['district'], _count: { _all: true }, where: { district: { not: null } }, orderBy: { _count: { id: 'desc' } }, take: 10 }),
    getWeeklySignups(),
  ]);

  const kpis = [
    { label: 'Total Members', value: totalMembers, color: 'bg-brand-blue' },
    { label: 'Volunteers', value: totalVolunteers, color: 'bg-brand-green' },
    { label: 'Teachers', value: totalTeachers, color: 'bg-brand-saffron' },
    { label: 'Open Grievances', value: openGrievances, color: 'bg-yellow-500' },
    { label: 'Resolved', value: resolvedGrievances, color: 'bg-emerald-500' },
    { label: 'Events', value: totalEvents, color: 'bg-purple-500' },
  ];

  return (
    <section className="section bg-brand-gray min-h-[calc(100vh-4rem)]">
      <div className="container-page space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-brand-blue">Admin Analytics</h1>
          <div className="flex items-center gap-2">
            <Link href={`/${locale}/admin/appointments`}><Button variant="outline" size="sm">Manage Appointments</Button></Link>
            <Badge variant="primary">{role}</Badge>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {kpis.map((k) => (
            <Card key={k.label}>
              <CardContent className="p-4">
                <div className={`h-1 w-12 ${k.color} rounded mb-2`} />
                <div className="text-2xl font-bold text-brand-blue">{k.value.toLocaleString('en-IN')}</div>
                <div className="text-xs text-muted-foreground">{k.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <AnalyticsCharts
          grievancesByCategory={grievancesByCategory.map((g) => ({ name: g.category, value: g._count._all }))}
          membersByDistrict={membersByDistrict.map((m) => ({ name: m.district ?? 'Unknown', value: m._count._all }))}
          weeklySignups={weeklySignups}
        />
      </div>
    </section>
  );
}

async function getWeeklySignups() {
  const days = 14;
  const start = new Date();
  start.setDate(start.getDate() - days);
  const users = await prisma.user.findMany({
    where: { createdAt: { gte: start } },
    select: { createdAt: true },
  });
  const buckets: Record<string, number> = {};
  for (let i = 0; i < days; i++) {
    const d = new Date(); d.setDate(d.getDate() - (days - 1 - i));
    buckets[d.toISOString().slice(0, 10)] = 0;
  }
  for (const u of users) {
    const k = u.createdAt.toISOString().slice(0, 10);
    if (k in buckets) buckets[k] += 1;
  }
  return Object.entries(buckets).map(([date, count]) => ({ date, count }));
}
