export const dynamic = 'force-dynamic';

import { AdminShell } from '@/components/AdminShell';
import { requireAdmin } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { MessageManager } from '@/components/MessageManager';

export default async function MessagesAdminPage() {
  await requireAdmin();
  const messages = await prisma.contactMessage.findMany({ orderBy: { createdAt: 'desc' } });
  return <AdminShell><MessageManager initialMessages={JSON.parse(JSON.stringify(messages))} /></AdminShell>;
}
