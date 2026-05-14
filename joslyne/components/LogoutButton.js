'use client';
import { csrfToken } from '@/lib/client';

export function LogoutButton() {
  async function logout() {
    await fetch('/api/admin/logout', { method: 'POST', headers: { 'x-csrf-token': csrfToken() } });
    window.location.href = '/admin/login';
  }
  return <button onClick={logout}>Logout</button>;
}
