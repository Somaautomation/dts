import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { teacherRequestSchema } from '@/lib/validators';
import { generateTicketId } from '@/lib/utils';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const userId = (session.user as any).id as string;
  const teacher = await prisma.teacher.findUnique({ where: { userId } });
  if (!teacher) return NextResponse.json({ error: 'Complete your teacher profile first' }, { status: 400 });

  try {
    const data = teacherRequestSchema.parse(await req.json());
    const r = await prisma.teacherRequest.create({
      data: {
        ...data,
        teacherId: teacher.id,
        ticketId: generateTicketId('TR'),
      },
    });
    return NextResponse.json({ ok: true, ticketId: r.ticketId, id: r.id });
  } catch (err: any) {
    if (err.issues) return NextResponse.json({ error: err.issues[0].message }, { status: 400 });
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
