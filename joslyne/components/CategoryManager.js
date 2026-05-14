'use client';
import { useState } from 'react';
import { csrfToken } from '@/lib/client';

export function CategoryManager({ initialCategories }) {
  const [categories, setCategories] = useState(initialCategories);
  const [status, setStatus] = useState('');

  async function refresh() {
    const res = await fetch('/api/admin/categories');
    const data = await res.json();
    setCategories(data.categories || []);
  }

  async function create(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const body = Object.fromEntries(new FormData(form));
    body.isVisible = Boolean(form.elements.isVisible.checked);
    const res = await fetch('/api/admin/categories', { method: 'POST', headers: { 'content-type': 'application/json', 'x-csrf-token': csrfToken() }, body: JSON.stringify(body) });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) return setStatus(data.error || 'Could not create category.');
    form.reset(); form.elements.isVisible.checked = true;
    await refresh(); setStatus('Category created.');
  }

  async function save(category, patch) {
    const res = await fetch(`/api/admin/categories/${category.id}`, { method: 'PATCH', headers: { 'content-type': 'application/json', 'x-csrf-token': csrfToken() }, body: JSON.stringify({ ...category, ...patch }) });
    if (res.ok) { await refresh(); setStatus('Category updated.'); }
  }

  async function remove(id) {
    if (!confirm('Delete this category and its photos?')) return;
    const res = await fetch(`/api/admin/categories/${id}`, { method: 'DELETE', headers: { 'x-csrf-token': csrfToken() } });
    if (res.ok) { setCategories((items) => items.filter((c) => c.id !== id)); setStatus('Category deleted.'); }
  }

  return (
    <>
      <p className="eyebrow">Categories</p><h1>Manage Categories</h1>
      <form className="form card" onSubmit={create}>
        <p className="tip">Tip: the homepage slider uses each category’s first visible photo as its cover. Put your strongest photo first by using lower sort numbers on photos.</p>
        <input className="input" name="name" placeholder="Category name" required />
        <textarea name="description" placeholder="Optional description" />
        <input className="input" name="sortOrder" type="number" min="0" defaultValue="0" />
        <label><input type="checkbox" name="isVisible" defaultChecked /> Visible</label>
        <button className="btn" type="submit">Create Category</button>
      </form>
      {status ? <p className="notice">{status}</p> : null}
      <table className="table"><thead><tr><th>Name</th><th>Description</th><th>Sort</th><th>Visible</th><th>Actions</th></tr></thead><tbody>
        {categories.map((category) => <tr key={category.id}>
          <td><input className="input" defaultValue={category.name} onBlur={(e) => e.target.value !== category.name && save(category, { name: e.target.value })} /></td>
          <td><textarea defaultValue={category.description || ''} onBlur={(e) => e.target.value !== (category.description || '') && save(category, { description: e.target.value })} /></td>
          <td><input className="input" type="number" defaultValue={category.sortOrder} onBlur={(e) => Number(e.target.value) !== category.sortOrder && save(category, { sortOrder: Number(e.target.value) })} /></td>
          <td><input type="checkbox" defaultChecked={category.isVisible} onChange={(e) => save(category, { isVisible: e.target.checked })} /></td>
          <td><button className="btn danger" onClick={() => remove(category.id)}>Delete</button></td>
        </tr>)}
      </tbody></table>
    </>
  );
}
