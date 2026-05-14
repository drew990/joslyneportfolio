'use client';
import { useMemo, useState } from 'react';
import Link from 'next/link';

export function GallerySlider({ collections = [] }) {
  const usable = useMemo(() => collections.filter(Boolean), [collections]);
  const [activeIndex, setActiveIndex] = useState(0);

  if (!usable.length) {
    return <div className="fullscreen-gallery-slider gallery-slider-empty"><span>In progress</span></div>;
  }

  const active = usable[activeIndex] || usable[0];
  const next = () => setActiveIndex((value) => (value + 1) % usable.length);
  const previous = () => setActiveIndex((value) => (value - 1 + usable.length) % usable.length);

  return (
    <section className="fullscreen-gallery-slider" aria-label="Featured gallery collections">
      <div
        className="gallery-slide-bg"
        style={active.imageUrl ? { backgroundImage: `url(${active.imageUrl})` } : undefined}
      >
        {!active.imageUrl ? <span className="slide-placeholder">In progress</span> : null}
      </div>
      <div className="gallery-slide-scrim" />

      <button className="gallery-arrow gallery-arrow-left" type="button" onClick={previous} aria-label="Previous gallery">‹</button>
      <button className="gallery-arrow gallery-arrow-right" type="button" onClick={next} aria-label="Next gallery">›</button>

      <div className="gallery-slide-content">
        <p className="eyebrow light-eyebrow">Featured collection</p>
        <span className="slide-number">{String(activeIndex + 1).padStart(2, '0')}</span>
        <h2>{active.name}</h2>
        <p>{active.description || 'In progress'}</p>
        <Link className="btn glass-btn" href={`/gallery/${active.slug}`}>View gallery</Link>
      </div>

      <div className="gallery-dots" aria-label="Gallery sections">
        {usable.map((item, index) => (
          <button
            type="button"
            key={item.id || item.slug}
            className={index === activeIndex ? 'active' : ''}
            onClick={() => setActiveIndex(index)}
            aria-label={`Show ${item.name}`}
          />
        ))}
      </div>
    </section>
  );
}
