'use client';
import { useState } from 'react';
import { csrfToken } from '@/lib/client';

export function MessageManager({ initialMessages }) {
  const [messages, setMessages] = useState(initialMessages);
  const [status, setStatus] = useState('');

  async function refresh() {
    const res = await fetch('/api/admin/messages');
    const data = await res.json();
    setMessages(data.messages || []);
  }

  async function markRead(id, isRead) {
    const res = await fetch('/api/admin/messages', { method: 'PATCH', headers: { 'content-type': 'application/json', 'x-csrf-token': csrfToken() }, body: JSON.stringify({ id, isRead }) });
    if (res.ok) { await refresh(); setStatus('Message updated.'); }
  }

  async function remove(id) {
    if (!confirm('Delete this message?')) return;
    const res = await fetch('/api/admin/messages', { method: 'DELETE', headers: { 'content-type': 'application/json', 'x-csrf-token': csrfToken() }, body: JSON.stringify({ id }) });
    if (res.ok) { setMessages((items) => items.filter((m) => m.id !== id)); setStatus('Message deleted.'); }
  }

  return (
    <>
      <p className="eyebrow">Messages</p><h1>Contact Messages</h1>
      {status ? <p className="notice">{status}</p> : null}
      <table className="table"><thead><tr><th>From</th><th>Message</th><th>Date</th><th>Actions</th></tr></thead><tbody>
        {messages.map((m) => <tr key={m.id}>
          <td><strong>{m.name}</strong><br /><a className="small" href={`mailto:${m.email}`}>{m.email}</a>{!m.isRead ? <p className="success">Unread</p> : null}</td>
          <td style={{ whiteSpace: 'pre-wrap' }}>{m.message}</td>
          <td>{new Date(m.createdAt).toLocaleString()}</td>
          <td className="row-actions"><button className="btn secondary" onClick={() => markRead(m.id, !m.isRead)}>{m.isRead ? 'Mark unread' : 'Mark read'}</button><button className="btn danger" onClick={() => remove(m.id)}>Delete</button></td>
        </tr>)}
      </tbody></table>
    </>
  );
}
