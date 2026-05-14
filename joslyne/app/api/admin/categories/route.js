import slugify from 'slugify';
import { prisma } from '@/lib/db';
import { assertAdminRequest } from '@/lib/auth';
import { categorySchema } from '@/lib/security';

function makeSlug(name) { return slugify(name, { lower: true, strict: true }); }

export async function GET() {
  const categories = await prisma.category.findMany({ orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }] });
  return Response.json({ categories });
}

export async function POST(request) {
  const denied = await assertAdminRequest(request);
  if (denied) return denied;
  try {
    const parsed = categorySchema.parse(await request.json());
    const category = await prisma.category.create({ data: { ...parsed, slug: makeSlug(parsed.name) } });
    return Response.json({ category });
  } catch (error) {
    return Response.json({ error: error.message || 'Category create failed.' }, { status: 400 });
  }
}
