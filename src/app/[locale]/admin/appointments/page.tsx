import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';

import { authOptions } from '@/lib/auth';
import { AppointmentsManager } from '@/components/admin/appointments-manager';

const ADMIN_ROLES = ['ADMIN', 'SUPER_ADMIN', 'MODERATOR', 'OFFICE_STAFF'];

export default async function AdminAppointmentsPage({ params: { locale } }: { params: { locale: string } }) {
  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role;
  if (!session || !ADMIN_ROLES.includes(role)) redirect(`/${locale}/auth/login`);

  return <AppointmentsManager locale={locale} />;
}
