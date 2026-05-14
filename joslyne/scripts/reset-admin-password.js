import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const username = (process.env.ADMIN_USERNAME || 'joslyne').trim();

await prisma.adminUser.upsert({
  where: { username },
  update: { passwordHash: null, hasEnteredAccount: false, lastLoginAt: null },
  create: { username, passwordHash: null, hasEnteredAccount: false }
});

console.log(`Admin setup reset for username: ${username}`);
await prisma.$disconnect();
