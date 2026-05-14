export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { AdminShell } from '@/components/AdminShell';
import { requireAdmin } from '@/lib/auth';
import { prisma } from '@/lib/db';

export default async function AdminPage() {
  await requireAdmin();
  const [photos, categories, unread, featured, messages] = await Promise.all([
    prisma.photo.count(),
    prisma.category.count(),
    prisma.contactMessage.count({ where: { isRead: false } }),
    prisma.photo.count({ where: { isFeatured: true } }),
    prisma.contactMessage.findMany({ orderBy: { createdAt: 'desc' }, take: 3 })
  ]);

  const cards = [
    { label: 'Photos', value: photos, href: '/admin/photos', note: 'Upload and organize portfolio images.' },
    { label: 'Categories', value: categories, href: '/admin/categories', note: 'Manage gallery sections.' },
    { label: 'Featured', value: featured, href: '/admin/photos', note: 'Used for homepage highlights.' },
    { label: 'Unread Messages', value: unread, href: '/admin/messages', note: 'New inquiries from the contact form.' }
  ];

  return (
    <AdminShell>
      <p className="eyebrow">Dashboard</p>
      <h1>CMS Overview</h1>
      <p className="admin-page-intro">Quick view of Joslyne’s website content. Use the cards below to jump into the area you want to update.</p>

      <div className="admin-card-grid">
        {cards.map((card) => (
          <Link key={card.label} href={card.href} className="admin-stat-card">
            <span>{card.label}</span>
            <strong>{card.value}</strong>
            <p>{card.note}</p>
          </Link>
        ))}
      </div>

      <div className="admin-quick-grid">
        <section className="card admin-quick-card">
          <p className="eyebrow">Quick Actions</p>
          <h2>Update the site</h2>
          <div className="admin-action-list">
            <Link href="/admin/photos">Upload new photos</Link>
            <Link href="/admin/about">Edit hero and about sections</Link>
            <Link href="/admin/categories">Manage gallery categories</Link>
            <Link href="/admin/messages">Read contact messages</Link>
          </div>
        </section>

        <section className="card admin-quick-card">
          <p className="eyebrow">Recent Messages</p>
          <h2>Inquiries</h2>
          {messages.length ? (
            <div className="admin-message-list">
              {messages.map((message) => (
                <Link key={message.id} href="/admin/messages" className="admin-message-card">
                  <strong>{message.name}</strong>
                  <span>{message.email}</span>
                  <p>{message.message.slice(0, 110)}{message.message.length > 110 ? '...' : ''}</p>
                </Link>
              ))}
            </div>
          ) : (
            <p className="muted">No messages yet.</p>
          )}
        </section>
      </div>
    </AdminShell>
  );
}
