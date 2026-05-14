export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import { PhotoGrid } from '@/components/PhotoGrid';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const category = await prisma.category.findUnique({ where: { slug } });
  return { title: category ? `${category.name} | Joslyne Keehmer` : 'Gallery' };
}

export default async function GallerySlugPage({ params }) {
  const { slug } = await params;
  const category = await prisma.category.findUnique({
    where: { slug },
    include: { photos: { where: { isVisible: true }, orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }] } }
  });
  if (!category || !category.isVisible) notFound();

  return (
    <>
      <section className="container page-hero centered-hero">
        <p className="eyebrow">Gallery</p>
        <h1>{category.name}</h1>
        <p className="lede">{category.description || 'In progress'}</p>
        <Link className="text-link" href="/gallery">Back to all galleries</Link>
      </section>
      <section className="container section gallery-detail-section">
        <PhotoGrid photos={category.photos} />
      </section>
    </>
  );
}
