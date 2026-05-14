import { prisma } from '@/lib/db';
import { assertAdminRequest } from '@/lib/auth';
import { siteSettingsSchema } from '@/lib/security';

export async function POST(request) {
  const denied = await assertAdminRequest(request);
  if (denied) return denied;
  try {
    const parsed = siteSettingsSchema.parse(await request.json());
    const existing = await prisma.siteSetting.findFirst();
    const settings = existing
      ? await prisma.siteSetting.update({ where: { id: existing.id }, data: parsed })
      : await prisma.siteSetting.create({ data: parsed });
    return Response.json({ settings });
  } catch (error) {
    const message = error?.issues?.[0]?.message || error.message || 'Homepage settings save failed.';
    return Response.json({ error: message }, { status: 400 });
  }
}
