export const dynamic = 'force-dynamic';

import { AdminShell } from '@/components/AdminShell';
import { requireAdmin } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { AboutManager } from '@/components/AboutManager';

export default async function AboutAdminPage() {
  await requireAdmin();
  const [about, settings, photos] = await Promise.all([
    prisma.aboutPage.findFirst(),
    prisma.siteSetting.findFirst(),
    prisma.photo.findMany({
      where: { isVisible: true },
      include: { category: true },
      orderBy: [{ isFeatured: 'desc' }, { sortOrder: 'asc' }, { createdAt: 'desc' }]
    })
  ]);

  return (
    <AdminShell>
      <AboutManager
        about={JSON.parse(JSON.stringify(about))}
        settings={JSON.parse(JSON.stringify(settings))}
        photos={JSON.parse(JSON.stringify(photos))}
      />
    </AdminShell>
  );
}
