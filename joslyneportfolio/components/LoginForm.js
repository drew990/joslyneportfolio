'use client';
import { useState } from 'react';

export function LoginForm({ username = 'joslyne', setupRequired = false }) {
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setError('');
    setBusy(true);

    const data = Object.fromEntries(new FormData(event.currentTarget));
    data.mode = setupRequired ? 'setup' : 'login';

    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(data)
    });

    setBusy(false);

    const body = await res.json().catch(() => ({}));

    if (res.ok) {
      if (body.mode === 'setup') {
        window.location.href = '/admin/login?setup=complete';
      } else {
        window.location.href = '/admin';
      }
      return;
    }

    setError(body.error || 'Login failed.');
  }

  return (
    <form className="form" onSubmit={submit}>
      {setupRequired ? (
        <>
          <label className="label">Static username</label>
          <input className="input" value={username} disabled />
        </>
      ) : (
        <>
          <label className="label">Username</label>
          <input className="input" name="username" type="text" defaultValue={username} required autoComplete="username" />
        </>
      )}

      <label className="label">{setupRequired ? 'Create password' : 'Password'}</label>
      <input
        className="input"
        name="password"
        type="password"
        placeholder={setupRequired ? 'Create a strong password' : 'Password'}
        required
        minLength={setupRequired ? 12 : 1}
        autoComplete={setupRequired ? 'new-password' : 'current-password'}
      />

      {setupRequired ? (
        <>
          <label className="label">Confirm password</label>
          <input className="input" name="confirmPassword" type="password" placeholder="Confirm password" required minLength={12} autoComplete="new-password" />
        </>
      ) : null}

      <button className="btn" type="submit" disabled={busy}>{busy ? 'Please wait...' : setupRequired ? 'Create Password' : 'Login'}</button>
      {error ? <p className="error">{error}</p> : null}
    </form>
  );
}
