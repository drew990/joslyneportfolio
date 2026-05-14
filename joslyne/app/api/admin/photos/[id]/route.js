import { prisma } from '@/lib/db';
import { assertAdminRequest } from '@/lib/auth';
import { photoSchema } from '@/lib/security';
import { deleteBlobPair } from '@/lib/blob';

export async function PATCH(request, { params }) {
  const denied = await assertAdminRequest(request);
  if (denied) return denied;
  try {
    const { id } = await params;
    const body = await request.json();
    const parsed = photoSchema.parse(body);
    const photo = await prisma.photo.update({ where: { id }, data: parsed });
    return Response.json({ photo });
  } catch (error) {
    return Response.json({ error: error.message || 'Photo update failed.' }, { status: 400 });
  }
}

export async function DELETE(request, { params }) {
  const denied = await assertAdminRequest(request);
  if (denied) return denied;
  try {
    const { id } = await params;
    const photo = await prisma.photo.findUnique({ where: { id } });
    if (!photo) return Response.json({ error: 'Photo not found.' }, { status: 404 });
    await deleteBlobPair(photo);
    await prisma.photo.delete({ where: { id } });
    return Response.json({ ok: true });
  } catch (error) {
    return Response.json({ error: error.message || 'Photo delete failed.' }, { status: 400 });
  }
}
