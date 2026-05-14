export const dynamic = 'force-dynamic';

import Link from 'next/link';
import Image from 'next/image';
import { prisma } from '@/lib/db';
import { GallerySlider } from '@/components/GallerySlider';

function InProgress({ className = '' }) {
  return <div className={`placeholder-box editorial-placeholder ${className}`}>In progress</div>;
}

function SplitHeroPanel({ src, alt, side }) {
  return (
    <div className={`split-hero-panel split-hero-${side}`}>
      {src ? (
        <Image src={src} alt={alt || 'Joslyne Keehmer portfolio photograph'} fill priority sizes="50vw" className="split-hero-image" />
      ) : (
        <InProgress className="split-hero-placeholder" />
      )}
    </div>
  );
}

export default async function HomePage() {
  const [settings, categories, featured, about] = await Promise.all([
    prisma.siteSetting.findFirst(),
    prisma.category.findMany({
      where: { isVisible: true },
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
      include: { photos: { where: { isVisible: true }, take: 1, orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }] } }
    }),
    prisma.photo.findMany({ where: { isVisible: true, isFeatured: true }, orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }], take: 12 }),
    prisma.aboutPage.findFirst()
  ]);

  const brandName = settings?.brandName || 'Joslyne Keehmer';
  const subtitle = settings?.heroEyebrow || 'Wedding · Portrait · Film · Nature';
  const intro = settings?.homepageIntro || 'Warm, honest, timeless photography.';
  const leftHero = settings?.heroLeftImageUrl || settings?.heroImageUrl || featured[0]?.imageUrl || featured[0]?.thumbUrl;
  const rightHero = settings?.heroRightImageUrl || featured[1]?.imageUrl || featured[1]?.thumbUrl || leftHero;
  const sliderCollections = categories.map((category) => {
    const cover = category.photos[0];
    return {
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description,
      imageUrl: cover?.imageUrl || cover?.thumbUrl || ''
    };
  });
  const aboutPreview = about?.body ? about.body.split('\n').filter(Boolean)[0] : 'A quiet look behind the lens, her story, and the way she sees each moment.';
  const aboutImage = settings?.aboutPreviewImageUrl || about?.imageUrl || featured[2]?.imageUrl || featured[2]?.thumbUrl;

  return (
    <>
      <section className="cinematic-hero" aria-label="Joslyne Keehmer photography hero">
        <div className="split-hero-media">
          <SplitHeroPanel src={leftHero} alt={settings?.heroLeftImageAlt || settings?.heroImageAlt} side="left" />
          <SplitHeroPanel src={rightHero} alt={settings?.heroRightImageAlt || settings?.heroImageAlt} side="right" />
        </div>
        <div className="hero-overlay" />
        <div className="hero-brand-story">
          <p className="hero-subtitle">{subtitle}</p>
          <h1>{brandName}</h1>
          <p>{intro}</p>
          <div className="button-row hero-buttons">
            <Link className="btn glass-btn" href="/gallery">{settings?.heroButtonText || 'Explore the work'}</Link>
            <Link className="btn glass-btn secondary-glass" href="/contact">Inquire</Link>
          </div>
        </div>
      </section>

      <div className="homepage-lift">
        <GallerySlider collections={sliderCollections} />

        <section className="about-peek-section">
          <div className="container about-peek-grid">
            <div className="about-peek-image">
              {aboutImage ? <Image src={aboutImage} alt={about?.headline || 'Meet Joslyne'} fill sizes="(max-width: 900px) 100vw, 40vw" /> : <InProgress />}
            </div>
            <div className="about-peek-copy">
              <p className="eyebrow">Behind the lens</p>
              <h2>{settings?.aboutPreviewTitle || about?.headline || 'Meet Joslyne'}</h2>
              <p>{settings?.aboutPreviewBody || aboutPreview}</p>
              <div className="button-row">
                <Link className="btn" href="/about">About Joslyne</Link>
                <Link className="btn secondary" href="/contact">Start an inquiry</Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
