import { assertAdminRequest, clearSession } from '@/lib/auth';
export async function POST(request) {
  const denied = await assertAdminRequest(request);
  if (denied) return denied;
  await clearSession();
  return Response.json({ ok: true });
}
