import { prisma } from '@/lib/db';
import { assertAdminRequest } from '@/lib/auth';

export async function GET() {
  const messages = await prisma.contactMessage.findMany({ orderBy: { createdAt: 'desc' } });
  return Response.json({ messages });
}

export async function PATCH(request) {
  const denied = await assertAdminRequest(request);
  if (denied) return denied;
  try {
    const { id, isRead } = await request.json();
    const message = await prisma.contactMessage.update({ where: { id }, data: { isRead: Boolean(isRead) } });
    return Response.json({ message });
  } catch {
    return Response.json({ error: 'Message update failed.' }, { status: 400 });
  }
}

export async function DELETE(request) {
  const denied = await assertAdminRequest(request);
  if (denied) return denied;
  try {
    const { id } = await request.json();
    await prisma.contactMessage.delete({ where: { id } });
    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: 'Message delete failed.' }, { status: 400 });
  }
}
