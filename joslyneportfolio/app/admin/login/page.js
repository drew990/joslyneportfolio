import { LoginForm } from '@/components/LoginForm';
import { prisma } from '@/lib/db';
import { getAdminUsername } from '@/lib/security';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

function needsPasswordSetup(admin) {
  return !admin || admin.accountSetupComplete !== true || !admin.passwordHash;
}

export default async function LoginPage({ searchParams }) {
  const username = getAdminUsername();
  let admin = await prisma.adminUser.findUnique({ where: { username } });

  if (!admin) {
    admin = await prisma.adminUser.create({
      data: {
        username,
        hasEnteredAccount: false,
        accountSetupComplete: false,
        passwordHash: null
      }
    });
  }

  const setupRequired = needsPasswordSetup(admin);
  const params = await searchParams;
  const setupComplete = params?.setup === 'complete';

  return (
    <section className="container section" style={{ maxWidth: 520 }}>
      <div className="card">
        <p className="eyebrow">Admin</p>
        <h1>{setupRequired ? 'Create Admin Password' : 'Login'}</h1>
        {setupComplete ? <p className="success">Password created. Log in now.</p> : null}
        {setupRequired ? (
          <>
            <p className="muted">Username: <strong>{username}</strong></p>
            <p className="notice">First-time setup: create the password for this admin account.</p>
          </>
        ) : (
          <p className="muted">Enter the admin username and password.</p>
        )}
        <LoginForm username={username} setupRequired={setupRequired} />
      </div>
    </section>
  );
}
