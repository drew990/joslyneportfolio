export const dynamic = 'force-dynamic';

import { AdminShell } from '@/components/AdminShell';
import { requireAdmin } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { CategoryManager } from '@/components/CategoryManager';

export default async function CategoriesAdminPage() {
  await requireAdmin();
  const categories = await prisma.category.findMany({ orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }] });
  return <AdminShell><CategoryManager initialCategories={JSON.parse(JSON.stringify(categories))} /></AdminShell>;
}
