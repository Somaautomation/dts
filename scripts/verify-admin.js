const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL || 'admin@dtsrinivas.com';
  const password = process.env.ADMIN_PASSWORD || 'ChangeMe!Strong#2026';

  const user = await prisma.user.findUnique({ where: { email } });
  const ok = user ? await bcrypt.compare(password, user.passwordHash || '') : false;

  console.log('Admin found:', !!user);
  console.log('Password matches:', ok);
  console.log('Role:', user?.role || 'N/A');
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
