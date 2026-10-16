import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { event } from "@/lib/event";

export const metadata: Metadata = { title: "2026 Timeline" };

// Global milestones: https://www.spaceappschallenge.org/2026/
// Detailed on-site timings are announced by the local organising committee.
const milestones = [
  { date: "Registration is open", title: "Choose Lucknow", text: "Create or sign in to your NASA Space Apps account, register for the 2026 hackathon and select Lucknow as your local event." },
  { date: "Before the hackathon", title: "Explore and find your team", text: "Read the official challenge summaries, explore data and meet teammates. Teams can have up to six members. Save project development for the hackathon itself." },
  { date: "14 November 2026", dateTime: event.startDate, title: "The hackathon begins", text: "Join us at SR Group of Institutions, Lucknow. Choose your challenge and begin creating a solution with your team." },
  { date: "15 November 2026", dateTime: event.endDate, title: "Complete and submit your project", text: "Present your work and submit through the Project tab on your official team page. The global project submission deadline is 11:59 PM local time." },
  { date: "After the hackathon", title: "Local selection and global judging", text: "Eligible projects selected from local events may advance for consideration for NASA Space Apps Global Awards. Further announcements will be shared through official channels." },
];

export default function Timeline() {
  return (
    <div className="page-shell">
      <header className="page-header">
        <p className="eyebrow">Your journey · {event.year}</p>
        <h1>Event timeline</h1>
        <p>{event.dates} at {event.venue}, Lucknow. Plan your weekend of discovery and collaboration.</p>
      </header>
      <ol className="timeline-list">
        {milestones.map((milestone) => (
          <li key={milestone.title}>
            {milestone.dateTime ? <time dateTime={milestone.dateTime}>{milestone.date}</time> : <span className="timeline-date">{milestone.date}</span>}
            <h2>{milestone.title}</h2><p>{milestone.text}</p>
          </li>
        ))}
      </ol>
      <section className="centered-cta">
        <h2>Stay close to the updates</h2>
        <p>Reporting times and the detailed SRGI programme will be shared by the Lucknow organising team. Join the WhatsApp community for local announcements.</p>
        <div className="button-group">
          <a href={event.whatsappUrl} className="action-link" target="_blank" rel="noopener noreferrer">Join WhatsApp community <ArrowUpRight size={18} aria-hidden="true" /></a>
          <a href={event.registrationUrl} className="action-link primary">Register now <ArrowUpRight size={18} aria-hidden="true" /></a>
        </div>
      </section>
    </div>
  );
}
