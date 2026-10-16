import type { Metadata } from "next";
import { ArrowUpRight, Mail, MapPin, MessageCircle, Instagram } from "lucide-react";
import { event } from "@/lib/event";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <div className="page-shell">
      <header className="page-header">
        <p className="eyebrow">Lucknow organising committee</p>
        <h1>Let&apos;s connect</h1>
        <p>Questions about registration, school participation or finding a team? Get in touch with the local organising team.</p>
      </header>
      <div className="contact-grid">
        <section className="panel">
          <MessageCircle className="panel-icon" size={30} aria-hidden="true" />
          <h2>Join our WhatsApp community</h2>
          <p>Follow event updates, connect with fellow participants and ask questions about the Lucknow event.</p>
          <a href={event.whatsappUrl} target="_blank" rel="noopener noreferrer" className="text-link">Join the community <ArrowUpRight size={18} aria-hidden="true" /></a>
        </section>
        <section className="panel">
          <Mail className="panel-icon" size={30} aria-hidden="true" />
          <h2>Email the organising team</h2>
          <p>For school coordination, participation queries or other enquiries, email us directly.</p>
          <a href={`mailto:${event.email}`} className="text-link email-link">{event.email}</a>
        </section>
        <section className="panel">
          <MapPin className="panel-icon" size={30} aria-hidden="true" />
          <h2>Find us at SRGI</h2>
          <p>{event.venue}<br />{event.address}<br />Uttar Pradesh, India</p>
          <p className="contact-address">{event.dates}</p>
          <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.venue + " " + event.address)}`} target="_blank" rel="noopener noreferrer" className="text-link">View venue on map <ArrowUpRight size={18} aria-hidden="true" /></a>
        </section>
        <section className="panel">
          <Instagram className="panel-icon" size={30} aria-hidden="true" />
          <h2>Follow the Lucknow event</h2>
          <p>Find announcements and community updates on our Instagram page.</p>
          <a href={event.instagramUrl} target="_blank" rel="noopener noreferrer" className="text-link">Visit Instagram <ArrowUpRight size={18} aria-hidden="true" /></a>
        </section>
      </div>
      <section className="faq" aria-labelledby="faq-title">
        <h2 id="faq-title">A few quick answers</h2>
        <details><summary>Can commerce, humanities or biology students participate?</summary><p>Yes. Students from every academic stream are welcome, as are people from other backgrounds. Research, business thinking, art, design and storytelling can all contribute to a project.</p></details>
        <details><summary>Do I need to know how to code?</summary><p>No. You do not need coding knowledge or previous hackathon experience. Choose a challenge and a role that fit your interests.</p></details>
        <details><summary>Can I register without a team?</summary><p>Yes. You can register first, explore the challenges and find teammates. Teams can have up to {event.teamLimit} members.</p></details>
        <details><summary>How can our school take part?</summary><p>Share the official registration page with interested students. A teacher coordinator can contact the organising team by email or through the WhatsApp community to discuss participation arrangements.</p></details>
      </section>
    </div>
  );
}
