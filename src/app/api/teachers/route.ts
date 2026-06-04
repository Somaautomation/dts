import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { teacherProfileSchema } from '@/lib/validators';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const userId = (session.user as any).id as string;
  try {
    const data = teacherProfileSchema.parse(await req.json());
    const t = await prisma.teacher.upsert({
      where: { userId },
      create: { ...data, userId },
      update: data,
    });
    await prisma.user.update({ where: { id: userId }, data: { role: 'TEACHER' } });
    return NextResponse.json({ ok: true, id: t.id });
  } catch (err: any) {
    if (err.issues) return NextResponse.json({ error: err.issues[0].message }, { status: 400 });
    if (err.code === 'P2002') return NextResponse.json({ error: 'Teacher ID already registered' }, { status: 409 });
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
