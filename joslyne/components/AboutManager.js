'use client';
import { useState } from 'react';
import Image from 'next/image';
import { csrfToken } from '@/lib/client';

function Tip({ children }) {
  return <p className="tip">Tip: {children}</p>;
}

function PhotoSelect({ name, label, value, photos = [], placeholder = 'Use automatic photo selection', tip }) {
  const selected = photos.find((photo) => photo.imageUrl === value || photo.thumbUrl === value);
  const hasCurrentExternal = value && !selected;

  return (
    <div className="photo-select-field">
      <label className="label">{label}</label>
      <div className="photo-select-row">
        <select name={name} defaultValue={value || ''} className="input">
          <option value="">{placeholder}</option>
          {hasCurrentExternal ? <option value={value}>Current saved image</option> : null}
          {photos.map((photo) => (
            <option key={photo.id} value={photo.imageUrl}>
              {photo.title} {photo.category?.name ? `- ${photo.category.name}` : ''}
            </option>
          ))}
        </select>
        <div className="photo-select-preview" aria-hidden="true">
          {selected?.thumbUrl ? (
            <Image src={selected.thumbUrl} alt="" fill sizes="96px" />
          ) : value ? (
            <span>Saved</span>
          ) : (
            <span>Auto</span>
          )}
        </div>
      </div>
      {tip ? <p className="small admin-help-text">{tip}</p> : null}
    </div>
  );
}

export function AboutManager({ about, settings, photos = [] }) {
  const [aboutStatus, setAboutStatus] = useState('');
  const [settingsStatus, setSettingsStatus] = useState('');

  async function submitAbout(event) {
    event.preventDefault();
    const body = Object.fromEntries(new FormData(event.currentTarget));
    const res = await fetch('/api/admin/about', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-csrf-token': csrfToken() },
      body: JSON.stringify(body)
    });
    const data = await res.json().catch(() => ({}));
    setAboutStatus(res.ok ? 'About page saved.' : data.error || 'Could not save about page.');
  }

  async function submitSettings(event) {
    event.preventDefault();
    const body = Object.fromEntries(new FormData(event.currentTarget));
    const res = await fetch('/api/admin/settings', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-csrf-token': csrfToken() },
      body: JSON.stringify(body)
    });
    const data = await res.json().catch(() => ({}));
    setSettingsStatus(res.ok ? 'Homepage settings saved.' : data.error || 'Could not save homepage settings.');
  }

  return (
    <>
      <p className="eyebrow">Website Content</p>
      <h1>Edit Homepage + About</h1>
      <p className="admin-page-intro">Update the public website without touching code. Select photos from uploaded files so Joslyne does not need to paste image URLs.</p>

      <form className="form card admin-form-section" onSubmit={submitSettings}>
        <div className="admin-section-heading">
          <div>
            <p className="eyebrow">Hero Section</p>
            <h2>Opening screen</h2>
          </div>
          <p className="admin-section-note">Controls the first full-screen section visitors see.</p>
        </div>
        <Tip>The hero uses two split background photos. Recommended: strong vertical or landscape images, at least 1600px wide. Upload the photos first in Photos, then select them here.</Tip>

        <div className="admin-two-column-form">
          <div>
            <label className="label">Brand name</label>
            <input className="input" name="brandName" defaultValue={settings?.brandName || 'Joslyne Keehmer'} required />
          </div>
          <div>
            <label className="label">Subtitle under name</label>
            <input className="input" name="heroEyebrow" defaultValue={settings?.heroEyebrow || 'Wedding · Portrait · Film · Nature'} required />
          </div>
        </div>

        <label className="label">Hero title</label>
        <input className="input" name="homepageTitle" defaultValue={settings?.homepageTitle || 'Photography for honest, timeless moments'} required />

        <label className="label">Hero intro line</label>
        <textarea name="homepageIntro" defaultValue={settings?.homepageIntro || ''} required />

        <label className="label">Primary button text</label>
        <input className="input" name="heroButtonText" defaultValue={settings?.heroButtonText || 'Explore the work'} required />

        <div className="admin-two-column-form">
          <PhotoSelect
            name="heroLeftImageUrl"
            label="Left hero photo"
            value={settings?.heroLeftImageUrl || settings?.heroImageUrl || ''}
            photos={photos}
            tip="This fills the left half of the hero. Choose a photo that still looks good cropped."
          />
          <PhotoSelect
            name="heroRightImageUrl"
            label="Right hero photo"
            value={settings?.heroRightImageUrl || ''}
            photos={photos}
            tip="This fills the right half of the hero. Use a different image for a stronger first impression."
          />
        </div>

        <div className="admin-two-column-form">
          <div>
            <label className="label">Left image alt text</label>
            <input className="input" name="heroLeftImageAlt" defaultValue={settings?.heroLeftImageAlt || settings?.heroImageAlt || ''} placeholder="Short description for accessibility" />
          </div>
          <div>
            <label className="label">Right image alt text</label>
            <input className="input" name="heroRightImageAlt" defaultValue={settings?.heroRightImageAlt || ''} placeholder="Short description for accessibility" />
          </div>
        </div>
        <input type="hidden" name="heroImageUrl" value={settings?.heroImageUrl || ''} />
        <input type="hidden" name="heroImageAlt" value={settings?.heroImageAlt || ''} />

        <div className="admin-section-divider" />
        <div className="admin-section-heading">
          <div>
            <p className="eyebrow">Gallery Slider</p>
            <h2>Homepage gallery story</h2>
          </div>
          <p className="admin-section-note">Uses the first visible photo inside each category.</p>
        </div>
        <Tip>Put the best cover image first in each category by using lower sort numbers in Photos.</Tip>

        <label className="label">Slider title</label>
        <input className="input" name="gallerySliderTitle" defaultValue={settings?.gallerySliderTitle || 'Browse the galleries'} required />

        <label className="label">Slider intro</label>
        <textarea name="gallerySliderIntro" defaultValue={settings?.gallerySliderIntro || ''} required />

        <div className="admin-section-divider" />
        <div className="admin-section-heading">
          <div>
            <p className="eyebrow">About Preview</p>
            <h2>Homepage about section</h2>
          </div>
          <p className="admin-section-note">Short preview only. The full story goes in About Page below.</p>
        </div>
        <Tip>Keep this short and warm. Recommended image: portrait, behind-the-scenes, or a photo that feels personal.</Tip>

        <label className="label">About preview title</label>
        <input className="input" name="aboutPreviewTitle" defaultValue={settings?.aboutPreviewTitle || ''} placeholder="Meet Joslyne" />

        <label className="label">About preview short text</label>
        <textarea name="aboutPreviewBody" defaultValue={settings?.aboutPreviewBody || ''} placeholder="Short homepage intro for the about section" />

        <PhotoSelect
          name="aboutPreviewImageUrl"
          label="About preview photo"
          value={settings?.aboutPreviewImageUrl || ''}
          photos={photos}
          placeholder="No preview photo selected"
          tip="This appears on the homepage only. The full About page image is selected below."
        />

        <div className="admin-section-divider" />
        <div className="admin-section-heading">
          <div>
            <p className="eyebrow">Links</p>
            <h2>Social + contact</h2>
          </div>
        </div>
        <div className="admin-two-column-form">
          <div>
            <label className="label">Instagram URL</label>
            <input className="input" name="instagramUrl" defaultValue={settings?.instagramUrl || ''} placeholder="https://instagram.com/..." />
          </div>
          <div>
            <label className="label">Contact email</label>
            <input className="input" name="contactEmail" defaultValue={settings?.contactEmail || ''} placeholder="email@example.com" />
          </div>
        </div>

        <button className="btn" type="submit">Save Homepage Settings</button>
      </form>
      {settingsStatus ? <p className="notice">{settingsStatus}</p> : null}

      <form className="form card admin-form-section" onSubmit={submitAbout}>
        <div className="admin-section-heading">
          <div>
            <p className="eyebrow">About Page</p>
            <h2>Full about page</h2>
          </div>
          <p className="admin-section-note">This is separate from the homepage hero and preview.</p>
        </div>
        <Tip>Recommended about image: portrait or vertical crop, at least 1200px tall. Select one of the uploaded photos.</Tip>

        <label className="label">Headline</label>
        <input className="input" name="headline" defaultValue={about?.headline || 'About Joslyne'} required />

        <label className="label">Body</label>
        <textarea name="body" defaultValue={about?.body || ''} required style={{ minHeight: 280 }} />

        <PhotoSelect
          name="imageUrl"
          label="About page photo"
          value={about?.imageUrl || ''}
          photos={photos}
          placeholder="No about photo selected"
          tip="This appears on the About page, not the homepage hero."
        />

        <button className="btn" type="submit">Save About Page</button>
      </form>
      {aboutStatus ? <p className="notice">{aboutStatus}</p> : null}
    </>
  );
}
