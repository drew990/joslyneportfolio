export const dynamic = 'force-dynamic';

import Image from 'next/image';
import Link from 'next/link';
import { prisma } from '@/lib/db';

export const metadata = { title: 'About | Joslyne Keehmer' };

export default async function AboutPage() {
  const about = await prisma.aboutPage.findFirst();
  return (
    <>
      <section className="container about-hero">
        <div className="about-image-card">
          {about?.imageUrl ? <Image src={about.imageUrl} alt="Joslyne Keehmer" width={1000} height={1300} priority /> : <div className="placeholder-box editorial-placeholder">In progress</div>}
        </div>
        <div className="about-copy">
          <p className="eyebrow">About</p>
          <h1>{about?.headline || 'Meet Joslyne'}</h1>
          <p style={{ whiteSpace: 'pre-wrap' }}>{about?.body || 'In progress'}</p>
          <Link className="btn secondary" href="/contact">Get in touch</Link>
        </div>
      </section>

      <section className="container quote-panel">
        <p>“Photography is about preserving the feeling of a moment, not just the way it looked.”</p>
      </section>
    </>
  );
}
