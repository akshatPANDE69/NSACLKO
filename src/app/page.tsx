import Link from "next/link";
import { ArrowDown, ArrowUpRight, CalendarDays, MapPin, MessageCircle, Users } from "lucide-react";
import { event } from "@/lib/event";
import HeroVideo from "./components/HeroVideo";

export default function Home() {
  return (
    <div className="home-page">
      <section className="home-hero" id="home" aria-labelledby="hero-title">
        <HeroVideo />
        <div className="hero-shade" aria-hidden="true" />
        <div className="hero-stars" aria-hidden="true" />
        <div className="home-hero-content">
          <p className="eyebrow">NASA Space Apps Challenge {event.year} · Lucknow</p>
          <h1 id="hero-title">Building solutions<br />for space &amp; Earth</h1>
          <p className="home-hero-description">
            Explore {event.theme.toLowerCase()} with a world of curious minds.
            Turn NASA&apos;s open data into ideas that make a difference, right here in Lucknow.
          </p>
          <p className="hero-event-date"><CalendarDays size={18} aria-hidden="true" /> {event.dates}</p>
          <div className="button-group hero-actions">
            <a href={event.registrationUrl} className="action-link primary">Register now <ArrowUpRight size={18} aria-hidden="true" /></a>
            <a href="#about" className="action-link">Explore the event <ArrowDown size={18} aria-hidden="true" /></a>
          </div>
          <div className="hero-community">
            <a href={event.whatsappUrl} className="community-link" target="_blank" rel="noopener noreferrer">
              <MessageCircle size={20} aria-hidden="true" /> Join our WhatsApp community <ArrowUpRight size={16} aria-hidden="true" />
            </a>
            <p>Event updates, questions and finding your team.</p>
          </div>
        </div>
      </section>

      <section className="event-facts" aria-label="Event at a glance">
        <div><CalendarDays aria-hidden="true" /><p><span>When</span>{event.dates}</p></div>
        <div><MapPin aria-hidden="true" /><p><span>Where</span>{event.venue}, Lucknow</p></div>
        <div><Users aria-hidden="true" /><p><span>Your team</span>Up to {event.teamLimit} members</p></div>
      </section>

      <section id="about" className="home-section">
        <div>
          <p className="eyebrow">Global challenge. Local community.</p>
          <h2>Hack the universe</h2>
        </div>
        <div className="section-copy">
          <p>NASA Space Apps is an international hackathon where people from different backgrounds work together on challenges facing Earth and space. Over two days, you choose a challenge, explore open data and develop a project with your team.</p>
          <p>Science, commerce, humanities, biology, design or technology: your perspective belongs here. No coding knowledge or previous hackathon experience is required.</p>
          <Link href="/about" className="text-link">Get to know Space Apps <ArrowUpRight size={18} aria-hidden="true" /></Link>
        </div>
      </section>

      <section className="home-section home-challenges">
        <div>
          <p className="eyebrow">Find your starting point</p>
          <h2>Different skills.<br />Shared discoveries.</h2>
        </div>
        <div className="section-copy">
          <p>Your project could be an app, a scientific model, a data exploration or a creative story. Bring your research, business thinking, art or technical skills and discover what you can make together.</p>
          <div className="button-group">
            <Link href="/challenges" className="action-link">Explore challenges <ArrowUpRight size={18} aria-hidden="true" /></Link>
            <Link href="/timeline" className="text-link">2026 timeline <ArrowUpRight size={18} aria-hidden="true" /></Link>
          </div>
        </div>
      </section>

      <section className="home-join">
        <p className="eyebrow">14 &amp; 15 November · SRGI, Lucknow</p>
        <h2>Bring your curiosity.<br />Find your people.</h2>
        <p>No team or project idea yet? You can still register and explore the challenges.</p>
        <a href={event.registrationUrl} className="action-link primary">Register for Lucknow <ArrowUpRight size={18} aria-hidden="true" /></a>
      </section>
    </div>
  );
}
