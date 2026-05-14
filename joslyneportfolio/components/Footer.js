import Link from 'next/link';

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div>
          <p className="footer-brand">Joslyne Keehmer</p>
          <p>Photography for honest details, soft light, and stories worth remembering.</p>
        </div>
        <div className="footer-links">
          <Link href="/gallery">Gallery</Link>
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
        </div>
        <p className="credit">© {new Date().getFullYear()} Joslyne Keehmer. Made by Andrew Banagas.</p>
      </div>
    </footer>
  );
}
