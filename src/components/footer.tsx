import Link from "next/link";
import { event } from "@/lib/event";

export default function FooterSection() {
  return (
    <footer className="site-footer">
      <p className="footer-name">NASA SPACE APPS CHALLENGE</p>
      <p>Lucknow {event.year} · {event.dates}</p>
      <nav aria-label="Footer navigation" className="footer-links">
        <Link href="/about">About</Link>
        <Link href="/contact">Contact &amp; help</Link>
        <a href={event.registrationUrl}>Register</a>
        <a href={event.whatsappUrl} target="_blank" rel="noopener noreferrer">WhatsApp community</a>
        <a href={event.instagramUrl} target="_blank" rel="noopener noreferrer">Instagram</a>
      </nav>
      <p className="footer-note">Organised by the Lucknow local organising committee.</p>
      <p className="footer-note">© {event.year} NASA Space Apps Challenge Lucknow. All rights reserved.</p>
    </footer>
  );
}
