import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, CalendarDays, MapPin, Users } from "lucide-react";
import { event } from "@/lib/event";
import "@/app/styles/news.css";

export const metadata: Metadata = {
  title: "News | NASA Space Apps Challenge Lucknow 2026",
  description: `The latest event information for NASA Space Apps Challenge ${event.year} in Lucknow.`,
};

const updates = [
  {
    label: "Event dates",
    title: "Two days to build something that matters",
    description: `Join the Lucknow local event on ${event.dates}. Bring your curiosity and collaborate on challenges for Earth and space.`,
    detail: "14–15 November 2026",
    Icon: CalendarDays,
  },
  {
    label: "Venue",
    title: "Meet us at SR Group of Institutions",
    description: `The Lucknow event will take place at ${event.venue}, ${event.address}.`,
    detail: event.venue,
    Icon: MapPin,
  },
  {
    label: "Teams",
    title: "Find your people and make a team",
    description: `Create a team of up to ${event.teamLimit} participants. You do not need previous hackathon experience to take part.`,
    detail: `Up to ${event.teamLimit} people per team`,
    Icon: Users,
  },
];

export default function NewsPage() {
  return (
    <div className="news-page">
      <div className="news-page-shell">
        <header className="news-page-header">
          <p className="news-page-eyebrow">NASA Space Apps Challenge / {event.year}</p>
          <h1>News</h1>
          <p className="news-page-intro">
            Event information and updates for the Space Apps community in Lucknow.
          </p>
          <a
            href={event.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="news-social-link"
          >
            Follow us for the latest updates <ArrowUpRight size={17} aria-hidden="true" />
          </a>
        </header>

        <section className="news-updates" aria-labelledby="news-updates-title">
          <div className="news-section-heading">
            <div>
              <p className="news-page-eyebrow">The latest</p>
              <h2 id="news-updates-title">Lucknow event updates</h2>
            </div>
            <span>{event.year} edition</span>
          </div>

          <div className="news-card-grid">
            {updates.map(({ label, title, description, detail, Icon }) => (
              <article className="news-card" key={label}>
                <div className="news-card-icon"><Icon size={20} aria-hidden="true" /></div>
                <p className="news-card-label">{label}</p>
                <h3>{title}</h3>
                <p className="news-card-description">{description}</p>
                <p className="news-card-detail">{detail}</p>
              </article>
            ))}
            <a
              href={event.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="news-community-link"
            >
              Join the WhatsApp community
            </a>
          </div>
        </section>

        <section className="news-next-steps" aria-labelledby="news-next-title">
          <div>
            <p className="news-page-eyebrow">Get involved</p>
            <h2 id="news-next-title">Ready to join the challenge?</h2>
            <p>Explore the challenges, register for the Lucknow event, and start building your team.</p>
          </div>
          <div className="news-actions">
            <a href={event.registrationUrl} className="hero-btn primary">
              Register now <ArrowUpRight size={17} aria-hidden="true" />
            </a>
            <Link href="/challenges" className="news-challenges-link">
              Explore challenges <ArrowUpRight size={15} aria-hidden="true" />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
