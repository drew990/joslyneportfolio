import Link from 'next/link';

export function Navbar() {
  return (
    <header className="nav glass-nav">
      <div className="container nav-inner">
        <Link className="brand" href="/" aria-label="Joslyne Keehmer home">
          <span>Joslyne</span>
          <span>Keehmer</span>
        </Link>
        <nav className="links" aria-label="Main navigation">
          <Link href="/gallery">Gallery</Link>
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
          <Link className="admin-link" href="/admin">Admin</Link>
        </nav>
      </div>
    </header>
  );
}
