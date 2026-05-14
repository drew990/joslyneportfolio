'use client';
import { useState } from 'react';
import Image from 'next/image';
import { compressImageInBrowser, csrfToken } from '@/lib/client';

export function PhotoManager({ initialPhotos, categories }) {
  const [photos, setPhotos] = useState(initialPhotos);
  const [status, setStatus] = useState('');

  async function refresh() {
    const res = await fetch('/api/admin/photos');
    const data = await res.json();
    setPhotos(data.photos || []);
  }

  async function upload(event) {
    event.preventDefault();
    setStatus('Compressing and uploading...');
    const form = event.currentTarget;
    const fd = new FormData(form);
    const file = fd.get('image');
    try {
      if (!file || !file.size) throw new Error('Choose a photo first.');
      const compressed = await compressImageInBrowser(file);
      fd.set('image', compressed);
      const res = await fetch('/api/admin/photos', { method: 'POST', headers: { 'x-csrf-token': csrfToken() }, body: fd });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Upload failed.');
      form.reset();
      await refresh();
      setStatus('Photo uploaded.');
    } catch (error) { setStatus(error.message); }
  }

  async function remove(id) {
    if (!confirm('Delete this photo?')) return;
    const res = await fetch(`/api/admin/photos/${id}`, { method: 'DELETE', headers: { 'x-csrf-token': csrfToken() } });
    if (res.ok) { setPhotos((items) => items.filter((p) => p.id !== id)); setStatus('Photo deleted.'); }
  }

  async function save(photo, patch) {
    const res = await fetch(`/api/admin/photos/${photo.id}`, {
      method: 'PATCH', headers: { 'content-type': 'application/json', 'x-csrf-token': csrfToken() }, body: JSON.stringify({ ...photo, ...patch, categoryId: patch.categoryId || photo.categoryId })
    });
    if (res.ok) { await refresh(); setStatus('Photo updated.'); }
  }

  return (
    <>
      <p className="eyebrow">Photos</p><h1>Manage Photos</h1>
      <form className="form card" onSubmit={upload}>
        <p className="tip">Tip: upload JPG, PNG, or WebP images. The app compresses photos automatically. For homepage hero or slider photos, landscape or wide portrait images around 1800px wide look best. Square, tall, and wide photos will all crop safely on the public site.</p>
        <input className="input" name="title" placeholder="Photo title" required />
        <input className="input" name="alt" placeholder="Alt text" />
        <textarea name="description" placeholder="Optional description" />
        <select name="categoryId" required>{categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select>
        <input className="input" name="sortOrder" type="number" min="0" defaultValue="0" placeholder="Sort order" />
        <label><input type="checkbox" name="isFeatured" /> Featured on home page</label>
        <p className="small">Featured photos can appear in the homepage hero and skill showcase. Pick only Joslyne’s strongest images.</p>
        <label><input type="checkbox" name="isVisible" defaultChecked /> Visible</label>
        <input className="input" type="file" name="image" accept="image/jpeg,image/png,image/webp" required />
        <button className="btn" type="submit">Upload Photo</button>
      </form>
      {status ? <p className="notice">{status}</p> : null}
      <table className="table"><thead><tr><th>Photo</th><th>Info</th><th>Settings</th><th>Actions</th></tr></thead><tbody>
        {photos.map((photo) => <tr key={photo.id}>
          <td>{photo.thumbUrl ? <Image src={photo.thumbUrl} alt={photo.title} width={90} height={90} style={{ objectFit: 'cover', borderRadius: 12 }} /> : null}</td>
          <td><strong>{photo.title}</strong><br /><span className="small">{photo.category?.name}</span></td>
          <td className="form">
            <input className="input" defaultValue={photo.title} onBlur={(e) => e.target.value !== photo.title && save(photo, { title: e.target.value })} />
            <select defaultValue={photo.categoryId} onChange={(e) => save(photo, { categoryId: e.target.value })}>{categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select>
            <input className="input" type="number" defaultValue={photo.sortOrder} onBlur={(e) => Number(e.target.value) !== photo.sortOrder && save(photo, { sortOrder: Number(e.target.value) })} />
            <label><input type="checkbox" defaultChecked={photo.isFeatured} onChange={(e) => save(photo, { isFeatured: e.target.checked })} /> Featured</label>
            <label><input type="checkbox" defaultChecked={photo.isVisible} onChange={(e) => save(photo, { isVisible: e.target.checked })} /> Visible</label>
          </td>
          <td><button className="btn danger" onClick={() => remove(photo.id)}>Delete</button></td>
        </tr>)}
      </tbody></table>
    </>
  );
}
