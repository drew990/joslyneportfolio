import slugify from 'slugify';
import { prisma } from '@/lib/db';
import { assertAdminRequest } from '@/lib/auth';
import { categorySchema } from '@/lib/security';
import { deleteBlobPair } from '@/lib/blob';

function makeSlug(name) { return slugify(name, { lower: true, strict: true }); }

export async function PATCH(request, { params }) {
  const denied = await assertAdminRequest(request);
  if (denied) return denied;
  try {
    const { id } = await params;
    const parsed = categorySchema.parse(await request.json());
    const category = await prisma.category.update({ where: { id }, data: { ...parsed, slug: makeSlug(parsed.name) } });
    return Response.json({ category });
  } catch (error) {
    return Response.json({ error: error.message || 'Category update failed.' }, { status: 400 });
  }
}

export async function DELETE(request, { params }) {
  const denied = await assertAdminRequest(request);
  if (denied) return denied;
  try {
    const { id } = await params;
    const photos = await prisma.photo.findMany({ where: { categoryId: id } });
    for (const photo of photos) await deleteBlobPair(photo);
    await prisma.category.delete({ where: { id } });
    return Response.json({ ok: true });
  } catch (error) {
    return Response.json({ error: error.message || 'Category delete failed.' }, { status: 400 });
  }
}
