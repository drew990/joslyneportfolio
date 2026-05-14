import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

function secretKey() {
  const secret = process.env.AUTH_SECRET || 'missing-secret-missing-secret-missing-secret';
  return new TextEncoder().encode(secret);
}

async function validSession(request) {
  const token = request.cookies.get('jk_session')?.value;
  if (!token) return false;
  try {
    await jwtVerify(token, secretKey());
    return true;
  } catch {
    return false;
  }
}

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  const isAdminPage = pathname.startsWith('/admin') && pathname !== '/admin/login';
  const isAdminApi = pathname.startsWith('/api/admin') && pathname !== '/api/admin/login';

  if (!isAdminPage && !isAdminApi) return NextResponse.next();

  const ok = await validSession(request);
  if (!ok && isAdminApi) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!ok) {
    const url = request.nextUrl.clone();
    url.pathname = '/admin/login';
    return NextResponse.redirect(url);
  }

  const res = NextResponse.next();
  res.headers.set('X-Frame-Options', 'DENY');
  res.headers.set('X-Content-Type-Options', 'nosniff');
  res.headers.set('Referrer-Policy', 'same-origin');
  return res;
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*']
};
