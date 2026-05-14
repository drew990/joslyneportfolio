export const dynamic = 'force-dynamic';

import { AdminShell } from '@/components/AdminShell';
import { requireAdmin } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { PhotoManager } from '@/components/PhotoManager';

export default async function PhotosAdminPage() {
  await requireAdmin();
  const [photos, categories] = await Promise.all([
    prisma.photo.findMany({ include: { category: true }, orderBy: [{ createdAt: 'desc' }] }),
    prisma.category.findMany({ orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }] })
  ]);
  return <AdminShell><PhotoManager initialPhotos={JSON.parse(JSON.stringify(photos))} categories={JSON.parse(JSON.stringify(categories))} /></AdminShell>;
}
