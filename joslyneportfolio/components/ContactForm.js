'use client';
import { useState } from 'react';

export function ContactForm() {
  const [status, setStatus] = useState('');
  const [isSending, setIsSending] = useState(false);

  async function submit(event) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = Object.fromEntries(new FormData(formElement));

    setIsSending(true);
    setStatus('Sending...');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(form)
      });

      if (res.ok) {
        formElement.reset();
        setStatus('Message sent. Joslyne will be able to view it in the dashboard.');
        return;
      }

      const data = await res.json().catch(() => ({}));
      setStatus(data.error || 'Could not send message. Please try again.');
    } catch {
      setStatus('Could not send message. Please try again.');
    } finally {
      setIsSending(false);
    }
  }

  return (
    <form className="form contact-form" onSubmit={submit}>
      <label>
        <span>Name</span>
        <input className="input" name="name" placeholder="Your name" required />
      </label>
      <label>
        <span>Email</span>
        <input className="input" name="email" type="email" placeholder="you@example.com" required />
      </label>
      <label>
        <span>Message</span>
        <textarea name="message" placeholder="Tell Joslyne what you are looking for" required />
      </label>
      <input name="website" tabIndex="-1" autoComplete="off" style={{ display: 'none' }} />
      <button className="btn" type="submit" disabled={isSending}>{isSending ? 'Sending...' : 'Send Message'}</button>
      {status ? <p className={status.startsWith('Message sent') ? 'success' : status === 'Sending...' ? 'notice' : 'error'}>{status}</p> : null}
    </form>
  );
}
