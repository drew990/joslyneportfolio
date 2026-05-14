import { prisma } from '@/lib/db';
import { assertAdminRequest } from '@/lib/auth';
import { assertSafeImage, photoSchema } from '@/lib/security';
import { uploadCompressedImage } from '@/lib/blob';

export async function GET() {
  const photos = await prisma.photo.findMany({ include: { category: true }, orderBy: [{ createdAt: 'desc' }] });
  return Response.json({ photos });
}

export async function POST(request) {
  const denied = await assertAdminRequest(request);
  if (denied) return denied;

  try {
    const form = await request.formData();
    const parsed = photoSchema.parse({
      title: form.get('title'),
      alt: form.get('alt') || '',
      description: form.get('description') || '',
      categoryId: form.get('categoryId'),
      sortOrder: form.get('sortOrder') || 0,
      isFeatured: form.get('isFeatured') === 'on' || form.get('isFeatured') === 'true',
      isVisible: form.get('isVisible') === 'on' || form.get('isVisible') === 'true'
    });
    const image = form.get('image');
    assertSafeImage(image);
    const uploaded = await uploadCompressedImage(image);
    const photo = await prisma.photo.create({ data: { ...parsed, ...uploaded } });
    return Response.json({ photo });
  } catch (error) {
    return Response.json({ error: error.message || 'Photo upload failed.' }, { status: 400 });
  }
}
