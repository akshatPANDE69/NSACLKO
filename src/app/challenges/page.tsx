import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Earth, Orbit, ChartNoAxesCombined, Palette } from "lucide-react";
import { event } from "@/lib/event";

export const metadata: Metadata = { title: "2026 Challenges" };

const areas = [
  { title: "Earth science & our environment", description: "Bring an interest in biology, climate, agriculture or the systems that connect life on Earth.", skills: "Science · Biology · Research", Icon: Earth },
  { title: "Space & exploration", description: "Explore questions about the Moon, Mars and beyond through science, models or creative thinking.", skills: "Physics · Astronomy · Modelling", Icon: Orbit },
  { title: "Research, data & technology", description: "Find patterns, investigate evidence or develop a tool that helps people understand and use open data.", skills: "Analysis · Business thinking · Coding", Icon: ChartNoAxesCombined },
  { title: "Art, design & storytelling", description: "Make complex ideas accessible through visual communication, stories, multimedia or interactive experiences.", skills: "Humanities · Design · Communication", Icon: Palette },
];

export default function ChallengePage() {
  return (
    <div className="page-shell">
      <header className="page-header">
        <p className="eyebrow">{event.theme} · {event.year}</p>
        <h1>Explore the challenges</h1>
        <p>Start with what interests you. Find an official NASA challenge where your team can contribute.</p>
      </header>
      <section className="centered-cta">
        <h2>Browse NASA&apos;s official 2026 challenges</h2>
        <p>Explore this year&apos;s challenge summaries, then read the full briefs and resources on the official Space Apps website as they become available.</p>
        <div className="button-group"><a href={event.challengesUrl} className="action-link primary">View official challenges <ArrowUpRight size={18} aria-hidden="true" /></a></div>
      </section>
      <section aria-labelledby="interests-heading" className="content-section" style={{ marginTop: 64 }}>
        <h2 id="interests-heading">Many ways to contribute</h2>
        <p className="notice">These are starting points for your interests. Choose your competition challenge from the official 2026 catalogue.</p>
        <div className="topic-grid">
          {areas.map(({ title, description, skills, Icon }) => (
            <article className="panel" key={title}>
              <Icon className="panel-icon" size={30} aria-hidden="true" />
              <h3>{title}</h3><p>{description}</p><span className="topic-label">{skills}</span>
            </article>
          ))}
        </div>
        <p className="notice">You can explore challenges and learn about the data before the event. Work on the project you submit should begin during the hackathon on 14 and 15 November.</p>
      </section>
      <section className="centered-cta">
        <h2>You do not need to be a coder</h2>
        <p>Students from science, commerce, humanities and biology are welcome. Bring a skill you enjoy or an idea you want to explore.</p>
        <div className="button-group">
          <a href={event.registrationUrl} className="action-link primary">Register for Lucknow <ArrowUpRight size={18} aria-hidden="true" /></a>
          <Link href="/contact" className="text-link">Questions? Get in touch <ArrowUpRight size={18} aria-hidden="true" /></Link>
        </div>
      </section>
    </div>
  );
}
