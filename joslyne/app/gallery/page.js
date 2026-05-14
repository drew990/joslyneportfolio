export const dynamic = 'force-dynamic';

import Link from 'next/link';
import Image from 'next/image';
import { prisma } from '@/lib/db';

export const metadata = { title: 'Gallery | Joslyne Keehmer' };

function InProgress() {
  return <div className="placeholder-box editorial-placeholder">In progress</div>;
}

export default async function GalleryPage() {
  const categories = await prisma.category.findMany({
    where: { isVisible: true },
    orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
    include: { photos: { where: { isVisible: true }, take: 1, orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }] } }
  });

  return (
    <>
      <section className="container page-hero centered-hero gallery-canvas-hero">
        <p className="eyebrow">Gallery</p>
        <h1>Collections on canvas</h1>
        <p className="lede">Choose a collection and step into a framed wall of Joslyne’s work.</p>
      </section>

      <section className="container gallery-canvas-section">
        {categories.length ? (
          <div className="canvas-category-grid">
            {categories.map((category, index) => {
              const cover = category.photos[0];
              return (
                <Link className="canvas-category-card" href={`/gallery/${category.slug}`} key={category.id} style={{ '--tilt': `${(index % 2 === 0 ? -1 : 1) * (2 + (index % 3))}deg` }}>
                  <div className="canvas-card-inner">
                    <div className="canvas-photo-window">
                      {cover ? <Image src={cover.thumbUrl || cover.imageUrl} alt={category.name} width={1000} height={1200} /> : <InProgress />}
                    </div>
                    <div className="canvas-card-meta">
                      <span>{String(index + 1).padStart(2, '0')}</span>
                      <h2>{category.name}</h2>
                      <p>{category.description || 'In progress'}</p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : <p className="notice">In progress</p>}
      </section>
    </>
  );
}
