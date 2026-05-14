import Link from 'next/link';
import { LogoutButton } from './LogoutButton';

export function AdminShell({ children }) {
  return (
    <div className="admin-shell">
      <aside className="card sidebar">
        <h3>Admin</h3>
        <Link href="/admin">Dashboard</Link>
        <Link href="/admin/photos">Photos</Link>
        <Link href="/admin/categories">Categories</Link>
        <Link href="/admin/about">About</Link>
        <Link href="/admin/messages">Messages</Link>
        <LogoutButton />
      </aside>
      <section className="card">{children}</section>
    </div>
  );
}
