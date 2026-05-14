import { prisma } from '@/lib/db';
import { assertAdminRequest } from '@/lib/auth';
import { aboutSchema } from '@/lib/security';

export async function POST(request) {
  const denied = await assertAdminRequest(request);
  if (denied) return denied;
  try {
    const parsed = aboutSchema.parse(await request.json());
    const existing = await prisma.aboutPage.findFirst();
    const about = existing
      ? await prisma.aboutPage.update({ where: { id: existing.id }, data: parsed })
      : await prisma.aboutPage.create({ data: parsed });
    return Response.json({ about });
  } catch (error) {
    return Response.json({ error: error.message || 'About save failed.' }, { status: 400 });
  }
}
