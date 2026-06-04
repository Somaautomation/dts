import { PrismaClient, Role, MembershipType, MembershipStatus, AchievementCategory, NewsType, EventType } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // --- Admin user ---
  const adminEmail = process.env.ADMIN_EMAIL ?? 'admin@dtsrinivas.com';
  const adminPassword = process.env.ADMIN_PASSWORD ?? 'ChangeMe!Strong#2026';
  const passwordHash = await bcrypt.hash(adminPassword, 12);

  const admin = await prisma.user.upsert({
    where: { phone: '9999999999' },
    update: {},
    create: {
      phone: '9999999999',
      email: adminEmail,
      name: 'Platform Administrator',
      passwordHash,
      role: Role.SUPER_ADMIN,
      phoneVerified: new Date(),
      emailVerified: new Date(),
    },
  });
  console.log('✅ Admin user:', admin.email);

  // --- Timeline events ---
  const timeline = [
    { year: 1975, title: 'Early Life & Education', description: 'Born and raised in Karnataka with strong commitment to public service.', category: 'personal' },
    { year: 1995, title: 'Student Leadership', description: 'Active in student politics championing teacher and student rights.', category: 'education' },
    { year: 2000, title: 'SEA Group of Institutions', description: 'Joined as Secretary, driving educational excellence.', category: 'education' },
    { year: 2010, title: 'Yadava Sangha Leadership', description: 'Elected State President of Karnataka State Yadava Sangha.', category: 'community' },
    { year: 2015, title: 'Category-1 Federation', description: 'State President, Karnataka State Category-1 Castes Federation.', category: 'community' },
    { year: 2020, title: 'OBC Department Chairman', description: 'Appointed Chairman, Karnataka State OBC Department.', category: 'political' },
    { year: 2024, title: 'Elected MLC', description: 'Elected to the Karnataka Legislative Council from South East Teachers Constituency.', category: 'political' },
  ];
  for (const [i, t] of timeline.entries()) {
    await prisma.timelineEvent.create({ data: { ...t, order: i, titleKn: t.title, descriptionKn: t.description } });
  }
  console.log('✅ Timeline seeded');

  // --- Achievements ---
  const achievements = [
    { slug: 'teacher-welfare-fund-2025', title: 'Teacher Welfare Fund Expansion', summary: 'Increased welfare fund allocations for over 5,000 teachers across South East constituency.', category: AchievementCategory.TEACHERS, impactStat: '5,000+ teachers', achievedOn: new Date('2025-03-15') },
    { slug: 'obc-scholarships-2025', title: 'OBC Student Scholarships Programme', summary: 'Launched scholarships supporting 10,000 OBC students for higher education.', category: AchievementCategory.OBC, impactStat: '10,000 students', achievedOn: new Date('2025-06-10') },
    { slug: 'rural-school-infrastructure', title: 'Rural School Infrastructure Drive', summary: 'Inaugurated 45 newly upgraded government school buildings.', category: AchievementCategory.INFRASTRUCTURE, impactStat: '45 schools', achievedOn: new Date('2024-11-20') },
    { slug: 'category-1-development', title: 'Category-1 Communities Development Plan', summary: 'Drove ₹150 crore allocation for Category-1 community welfare initiatives.', category: AchievementCategory.CATEGORY_1, impactStat: '₹150 Cr allocated', achievedOn: new Date('2025-01-05') },
  ];
  for (const a of achievements) {
    await prisma.achievement.upsert({
      where: { slug: a.slug },
      update: {},
      create: { ...a, body: a.summary, titleKn: a.title, summaryKn: a.summary, bodyKn: a.summary },
    });
  }
  console.log('✅ Achievements seeded');

  // --- News ---
  const news = [
    { slug: 'mlc-addresses-teachers-conference', title: 'MLC Addresses State Teachers Conference', excerpt: 'D.T. Srinivas highlighted teacher welfare priorities for the upcoming budget session.', type: NewsType.SPEECH },
    { slug: 'new-policy-obc-skill-training', title: 'New Policy on OBC Skill Training Launched', excerpt: 'Comprehensive skill development programme launched targeting OBC youth.', type: NewsType.PRESS_RELEASE },
    { slug: 'legislative-session-highlights', title: 'Legislative Session: Teacher Pension Reforms', excerpt: 'Key questions raised on long-pending pension reforms for aided school teachers.', type: NewsType.LEGISLATIVE_UPDATE },
  ];
  for (const n of news) {
    await prisma.newsArticle.upsert({
      where: { slug: n.slug },
      update: {},
      create: { ...n, body: n.excerpt, titleKn: n.title, excerptKn: n.excerpt, bodyKn: n.excerpt },
    });
  }
  console.log('✅ News seeded');

  // --- Events ---
  await prisma.event.upsert({
    where: { slug: 'teacher-grievance-camp-bengaluru' },
    update: {},
    create: {
      slug: 'teacher-grievance-camp-bengaluru',
      title: 'Teacher Grievance Camp — Bengaluru',
      titleKn: 'ಶಿಕ್ಷಕರ ಸಮಸ್ಯೆ ಶಿಬಿರ — ಬೆಂಗಳೂರು',
      description: 'A free grievance redressal camp for teachers in the South East constituency.',
      type: EventType.TEACHER_CONFERENCE,
      startsAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      endsAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000),
      venue: 'Town Hall, Bengaluru',
      district: 'Bengaluru Urban',
      capacity: 500,
      isFeatured: true,
      createdBy: admin.id,
    },
  });
  console.log('✅ Events seeded');

  console.log('🎉 Seed complete');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
