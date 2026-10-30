import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  await prisma.item.deleteMany();

  const items = await prisma.item.createMany({
    data: [
      { title: 'Setup AWS EC2', description: 'Configure EC2 instance with security groups', status: 'ACTIVE' },
      { title: 'Configure RDS', description: 'Setup PostgreSQL on RDS with private networking', status: 'ACTIVE' },
      { title: 'Build Docker image', description: 'Create multi-stage Dockerfile for production', status: 'ACTIVE' },
      { title: 'Setup CloudWatch', description: 'Configure log groups and metric alarms', status: 'ACTIVE' },
      { title: 'Old task', description: 'This item has been archived', status: 'ARCHIVED' },
    ],
  });

  console.log(`✅ Seeded ${items.count} items`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

