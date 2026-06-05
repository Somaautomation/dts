import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { appointmentSchema, appointmentStatusUpdateSchema } from '@/lib/validators';
import { generateTicketId } from '@/lib/utils';
import { apiRateLimiter } from '@/lib/rate-limit';

const ADMIN_ROLES = ['ADMIN', 'SUPER_ADMIN', 'MODERATOR', 'OFFICE_STAFF'];

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const userId = (session.user as any).id as string;
  const { success } = await apiRateLimiter.limit(`appointment:${userId}`);
  if (!success) return NextResponse.json({ error: 'Too many submissions' }, { status: 429 });

  try {
    const data = appointmentSchema.parse(await req.json());

    const event = data.eventSlug
      ? await prisma.event.findUnique({ where: { slug: data.eventSlug }, select: { id: true, slug: true } })
      : null;

    if (data.eventSlug && !event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    const appointment = await prisma.appointment.create({
      data: {
        ticketId: generateTicketId('APT'),
        userId,
        eventId: event?.id,
        name: data.name,
        phone: data.phone,
        preferredDate: new Date(`${data.preferredDate}T00:00:00.000Z`),
        preferredTime: data.preferredTime,
        notes: data.notes,
      },
      select: { id: true, ticketId: true, status: true },
    });

    await prisma.notification.create({
      data: {
        userId,
        type: 'grievance_update',
        title: 'Appointment requested',
        body: `Your appointment request ${appointment.ticketId} has been submitted.`,
        link: '/dashboard',
      },
    });

    return NextResponse.json({ ok: true, ...appointment });
  } catch (err: any) {
    if (err.issues) return NextResponse.json({ error: err.issues[0].message }, { status: 400 });
    return NextResponse.json({ error: 'Failed to create appointment' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const userId = (session.user as any).id as string;
  const role = (session.user as any).role as string;
  const isAdmin = ADMIN_ROLES.includes(role);

  const url = new URL(req.url);
  const status = url.searchParams.get('status') ?? undefined;

  const where = isAdmin
    ? { ...(status ? { status: status as any } : {}) }
    : { userId, ...(status ? { status: status as any } : {}) };

  const items = await prisma.appointment.findMany({
    where,
    orderBy: [{ createdAt: 'desc' }],
    include: {
      event: { select: { title: true, titleKn: true, slug: true } },
      user: { select: { name: true, phone: true, district: true, taluk: true } },
    },
    take: 100,
  });

  return NextResponse.json({ items });
}

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const role = (session.user as any).role as string;
  if (!ADMIN_ROLES.includes(role)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  try {
    const data = appointmentStatusUpdateSchema.parse(await req.json());

    const updated = await prisma.appointment.update({
      where: { id: data.id },
      data: {
        status: data.status,
        adminNotes: data.adminNotes,
        confirmedAt: ['CONFIRMED', 'RESCHEDULED', 'COMPLETED'].includes(data.status) ? new Date() : null,
        confirmedBy: (session.user as any).id as string,
      },
      include: { user: { select: { id: true } } },
    });

    await prisma.notification.create({
      data: {
        userId: updated.user.id,
        type: 'grievance_update',
        title: 'Appointment status updated',
        body: `Your appointment ${updated.ticketId} is now ${updated.status}.`,
        link: '/dashboard',
      },
    });

    return NextResponse.json({ ok: true, status: updated.status });
  } catch (err: any) {
    if (err.issues) return NextResponse.json({ error: err.issues[0].message }, { status: 400 });
    return NextResponse.json({ error: 'Failed to update appointment' }, { status: 500 });
  }
}
