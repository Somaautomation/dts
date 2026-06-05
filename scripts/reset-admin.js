const { PrismaClient, Role } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL || 'admin@dtsrinivas.com';
  const password = process.env.ADMIN_PASSWORD || 'ChangeMe!Strong#2026';
  const hash = await bcrypt.hash(password, 12);

  await prisma.user.upsert({
    where: { phone: '9999999999' },
    update: {
      email,
      name: 'Platform Administrator',
      passwordHash: hash,
      role: Role.SUPER_ADMIN,
      phoneVerified: new Date(),
      emailVerified: new Date(),
    },
    create: {
      phone: '9999999999',
      email,
      name: 'Platform Administrator',
      passwordHash: hash,
      role: Role.SUPER_ADMIN,
      phoneVerified: new Date(),
      emailVerified: new Date(),
    },
  });

  await prisma.user.updateMany({
    where: { email },
    data: {
      passwordHash: hash,
      role: Role.SUPER_ADMIN,
      emailVerified: new Date(),
    },
  });

  const admins = await prisma.user.findMany({
    where: { role: { in: [Role.ADMIN, Role.SUPER_ADMIN, Role.MODERATOR, Role.OFFICE_STAFF] } },
    select: { email: true, phone: true, role: true },
  });

  console.log('Admin accounts:', admins);
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
