# Security Review Notes

This project uses one admin account controlled by `ADMIN_USERNAME`.

## Account setup flow

- `/admin/login` reads `AdminUser.accountSetupComplete` and `AdminUser.passwordHash` from the database.
- If the admin record does not exist, the page creates it with `accountSetupComplete = false` and `passwordHash = null`.
- If `accountSetupComplete !== true` or `passwordHash` is empty, the page shows Create Admin Password.
- After the password is created, the password is hashed with bcrypt and saved in the database.
- After setup, every computer sees the normal username/password login because the setup state lives in the shared production database, not in one browser.

## Current protections

- Admin dashboard routes require a valid signed session cookie.
- Admin API routes require a valid signed session cookie.
- Mutating admin API routes use CSRF token validation.
- Passwords are hashed with bcrypt before being stored.
- Login username comparison uses timing-safe comparison.
- Login attempts are rate-limited in memory per runtime instance.
- Uploads are restricted to JPG, PNG, and WebP.
- Uploads enforce `MAX_UPLOAD_MB`.
- Images are compressed with Sharp before Blob storage.
- Prisma parameterized queries reduce SQL injection risk.
- Zod validation restricts input length and shape.
- Middleware sets security headers for protected admin routes.

## Practical notes

No website is hack-proof. Strength depends heavily on the password and on keeping Vercel/database/Blob tokens private.

Use a unique password of at least 16 characters. A long passphrase or random password stored in a password manager is strongly recommended.

For production, `AUTH_SECRET` must be a private random string of at least 32 characters. Do not commit `.env` to GitHub.

## Future hardening options

- Add two-factor authentication.
- Add persistent database-backed login attempt tracking.
- Add email notification on admin login.
- Add a password reset flow.
- Add Vercel Firewall rules for `/admin` if needed.
