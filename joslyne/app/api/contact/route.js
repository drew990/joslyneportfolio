import { prisma } from '@/lib/db';
import { contactSchema } from '@/lib/security';

export async function POST(request) {
  try {
    const body = await request.json();
    const parsed = contactSchema.parse(body);
    await prisma.contactMessage.create({ data: { name: parsed.name, email: parsed.email, message: parsed.message } });
    return Response.json({ ok: true });
  } catch (error) {
    return Response.json({ error: error.message || 'Invalid message.' }, { status: 400 });
  }
}
