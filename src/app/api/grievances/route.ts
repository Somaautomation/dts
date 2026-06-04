import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { grievanceSchema } from '@/lib/validators';
import { generateTicketId } from '@/lib/utils';
import { apiRateLimiter } from '@/lib/rate-limit';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const userId = (session.user as any).id as string;
  const { success } = await apiRateLimiter.limit(`grievance:${userId}`);
  if (!success) return NextResponse.json({ error: 'Too many submissions' }, { status: 429 });

  try {
    const data = grievanceSchema.parse(await req.json());
    const g = await prisma.grievance.create({
      data: {
        ...data,
        userId,
        ticketId: generateTicketId('GRV'),
      },
    });
    await prisma.notification.create({
      data: {
        userId,
        type: 'grievance_update',
        title: 'Grievance submitted',
        body: `Your grievance ${g.ticketId} has been received.`,
        link: `/dashboard/grievances/${g.id}`,
      },
    });
    return NextResponse.json({ ok: true, ticketId: g.ticketId, id: g.id });
  } catch (err: any) {
    if (err.issues) return NextResponse.json({ error: err.issues[0].message }, { status: 400 });
    return NextResponse.json({ error: 'Failed to submit' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const userId = (session.user as any).id as string;
  const role = (session.user as any).role as string;

  const url = new URL(req.url);
  const status = url.searchParams.get('status') ?? undefined;

  const where = ['ADMIN', 'SUPER_ADMIN', 'OFFICE_STAFF', 'MODERATOR'].includes(role)
    ? { ...(status ? { status: status as any } : {}) }
    : { userId, ...(status ? { status: status as any } : {}) };

  const items = await prisma.grievance.findMany({ where, orderBy: { createdAt: 'desc' }, take: 50 });
  return NextResponse.json({ items });
}
