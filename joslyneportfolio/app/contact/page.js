import { ContactForm } from '@/components/ContactForm';
export const metadata = { title: 'Contact | Joslyne Keehmer' };
export default function ContactPage() {
  return (
    <section className="container contact-layout">
      <div className="contact-copy">
        <p className="eyebrow">Contact</p>
        <h1>Let’s work together</h1>
        <p className="lede">For weddings, portraits, creative sessions, or questions about availability, send a note below.</p>
        <p>Every message is saved directly into the admin dashboard, so Joslyne can review inquiries without relying on the old third-party platform.</p>
      </div>
      <div className="card contact-card"><ContactForm /></div>
    </section>
  );
}
