# Joslyne Vercel CMS

Custom portfolio + dashboard using Next.js, Vercel Blob, Vercel Postgres/Neon, Prisma, and a custom admin login.

## Environment

Use a real `.env` file in the project root.

```env
BLOB_READ_WRITE_TOKEN="your_real_vercel_blob_token"
DATABASE_URL="your_real_neon_database_url"
AUTH_SECRET="your_real_random_auth_secret"
ADMIN_USERNAME="joslyne"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
MAX_UPLOAD_MB="4"
```

`AUTH_SECRET` is not the admin password. It is a random private secret used to secure the login session cookie.

Generate it with:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## Run locally

Only two commands are required:

```bash
npm install
npm run dev
```

The `dev` command automatically runs Prisma generate, database migrations, database seed, and the Next.js dev server.

## First login behavior

The database has an `AdminUser.hasEnteredAccount` flag.

- If `hasEnteredAccount` is `false`, `/admin/login` shows the static username and asks you to create a password.
- When the password is created, the password is hashed and saved in the database, and `hasEnteredAccount` becomes `true`.
- After that, `/admin/login` asks for username and password.

The admin username comes from `.env`:

```env
ADMIN_USERNAME="joslyne"
```

## Empty site behavior

The public website runs even with no photos or no custom content. Empty sections show `In progress` placeholders instead of crashing.

## Storage

Photos are stored in Vercel Blob. Metadata is stored in Postgres/Neon.

## Production notes

In Vercel, add the same real environment variables in Project Settings -> Environment Variables. Do not commit real `.env` values to GitHub.


## First admin password setup

Run only:

```bash
npm install
npm run dev
```

Then open `/admin/login`. If the admin account has never successfully logged in, the app shows **Create Admin Password** first. After creating the password, it redirects back to `/admin/login`, where you log in with `ADMIN_USERNAME` and the password you just created.

The seed script automatically repairs incomplete setup records from earlier builds: if the password was created but no successful login was recorded, it resets setup so the password screen appears again.

## Admin setup flow

Run only:

```bash
npm install
npm run dev
```

Then open `/admin/login`. On a fresh or repaired database, the page shows **Create Admin Password** first. After creating it, the app sends you back to `/admin/login`; then log in using `ADMIN_USERNAME` and the password you created.

This version uses `accountSetupComplete` in the database as the source of truth. Existing broken admin records from earlier versions are automatically reset during `npm run dev`.


## v8 frontend redesign notes

This version updates the public-facing site with a soft cream editorial photography layout inspired by luxury portfolio sites. It also fixes the contact form success bug by saving the form element before the async request and showing a confirmation message after the API saves the inquiry.

Use the same setup flow:

```bash
npm install
npm run dev
```

Keep real Vercel values in `.env`. The site will still render public pages with `In progress` placeholders when galleries or photos are empty.
