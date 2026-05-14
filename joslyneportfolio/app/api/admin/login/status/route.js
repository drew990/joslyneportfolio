import { prisma } from '@/lib/db';
import { getAdminUsername } from '@/lib/security';

export const dynamic = 'force-dynamic';

function needsPasswordSetup(admin) {
  return !admin || admin.accountSetupComplete !== true || !admin.passwordHash;
}

export async function GET() {
  const username = getAdminUsername();
  let admin = await prisma.adminUser.findUnique({ where: { username } });
  if (!admin) {
    admin = await prisma.adminUser.create({ data: { username, hasEnteredAccount: false, accountSetupComplete: false, passwordHash: null } });
  }
  return Response.json({ username, setupRequired: needsPasswordSetup(admin) });
}
