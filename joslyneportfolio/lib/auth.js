import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';
import crypto from 'crypto';
import { redirect } from 'next/navigation';
import { constantTimeEqual } from './security';

const sessionCookie = 'jk_session';
const csrfCookie = 'jk_csrf';

function secretKey() {
  let secret = process.env.AUTH_SECRET;
  const placeholder = !secret || secret === 'your_real_random_auth_secret';

  if ((placeholder || secret.length < 32) && process.env.NODE_ENV === 'production') {
    throw new Error('AUTH_SECRET must be set to a private random value at least 32 characters long.');
  }

  // Local development fallback so npm install + npm run dev works while you are setting up.
  // In Vercel production, set AUTH_SECRET to a real private value.
  if (placeholder || secret.length < 32) {
    secret = 'dev-only-joslyne-portfolio-session-secret-change-before-deploying';
  }

  return new TextEncoder().encode(secret);
}

export async function createSession(username) {
  const csrf = crypto.randomBytes(24).toString('hex');
  const token = await new SignJWT({ username, csrf })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('8h')
    .sign(secretKey());

  const jar = await cookies();
  jar.set(sessionCookie, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 8
  });
  jar.set(csrfCookie, csrf, {
    httpOnly: false,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 8
  });
}

export async function clearSession() {
  const jar = await cookies();
  jar.delete(sessionCookie);
  jar.delete(csrfCookie);
}

export async function getSession() {
  const jar = await cookies();
  const token = jar.get(sessionCookie)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secretKey());
    return payload;
  } catch {
    return null;
  }
}

export async function requireAdmin() {
  const session = await getSession();
  if (!session?.username) redirect('/admin/login');
  return session;
}

export async function assertAdminRequest(request) {
  const session = await getSession();
  if (!session?.username) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const jar = await cookies();
  const csrfFromCookie = jar.get(csrfCookie)?.value || '';
  const csrfFromHeader = request.headers.get('x-csrf-token') || '';
  if (!csrfFromCookie || !csrfFromHeader || !constantTimeEqual(csrfFromCookie, csrfFromHeader) || csrfFromCookie !== session.csrf) {
    return Response.json({ error: 'Invalid CSRF token' }, { status: 403 });
  }
  return null;
}
