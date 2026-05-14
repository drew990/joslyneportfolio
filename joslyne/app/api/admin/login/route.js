import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/db';
import { createSession } from '@/lib/auth';
import { constantTimeEqual, getAdminUsername, loginSchema, setupPasswordSchema } from '@/lib/security';

export const dynamic = 'force-dynamic';

const attempts = new Map();

function tooManyAttempts(ip) {
  const now = Date.now();
  const record = attempts.get(ip) || { count: 0, resetAt: now + 15 * 60 * 1000 };
  if (record.resetAt < now) {
    attempts.set(ip, { count: 1, resetAt: now + 15 * 60 * 1000 });
    return false;
  }
  record.count += 1;
  attempts.set(ip, record);
  return record.count > 8;
}

async function getOrCreateAdmin(username) {
  let admin = await prisma.adminUser.findUnique({ where: { username } });
  if (!admin) {
    admin = await prisma.adminUser.create({ data: { username, hasEnteredAccount: false, accountSetupComplete: false, passwordHash: null } });
  }
  return admin;
}

function needsPasswordSetup(admin) {
  return !admin || admin.accountSetupComplete !== true || !admin.passwordHash;
}

export async function POST(request) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || request.headers.get('x-real-ip') || 'local';
    if (tooManyAttempts(ip)) {
      return Response.json({ error: 'Too many login attempts. Try again later.' }, { status: 429 });
    }

    const configuredUsername = getAdminUsername();
    const raw = await request.json();
    const admin = await getOrCreateAdmin(configuredUsername);
    const setupRequired = needsPasswordSetup(admin);

    if (setupRequired) {
      const { password, confirmPassword } = setupPasswordSchema.parse(raw);
      if (password !== confirmPassword) {
        return Response.json({ error: 'Passwords do not match.' }, { status: 400 });
      }

      const passwordHash = await bcrypt.hash(password, 12);
      await prisma.adminUser.update({
        where: { username: configuredUsername },
        data: {
          passwordHash,
          hasEnteredAccount: false,
          accountSetupComplete: true,
          lastLoginAt: null
        }
      });

      attempts.delete(ip);
      return Response.json({ ok: true, mode: 'setup' });
    }

    const { username, password } = loginSchema.parse(raw);
    if (!constantTimeEqual(username, configuredUsername)) {
      return Response.json({ error: 'Invalid username or password.' }, { status: 401 });
    }

    const validPassword = await bcrypt.compare(password, admin.passwordHash);
    if (!validPassword) {
      return Response.json({ error: 'Invalid username or password.' }, { status: 401 });
    }

    await prisma.adminUser.update({ where: { username: configuredUsername }, data: { hasEnteredAccount: true, lastLoginAt: new Date() } });
    await createSession(configuredUsername);
    attempts.delete(ip);
    return Response.json({ ok: true, mode: 'login' });
  } catch (error) {
    const message = error?.issues?.[0]?.message || error?.message || 'Invalid login request.';
    return Response.json({ error: message }, { status: 400 });
  }
}
