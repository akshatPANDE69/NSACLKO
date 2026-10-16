import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Lightbulb, Users, Presentation } from "lucide-react";
import { event } from "@/lib/event";

export const metadata: Metadata = { title: "About" };

const benefits = [
  { title: "Learn by doing", text: "Explore open data, investigate a question and test ideas beyond your everyday school or college projects.", Icon: Lightbulb },
  { title: "Build together", text: "Combine research, science, business thinking, art and technology. Different perspectives make a stronger team.", Icon: Users },
  { title: "Share your work", text: "Explain your solution and present what your team creates. Selected local projects may advance to global judging.", Icon: Presentation },
];

export default function About() {
  return (
    <div className="page-shell">
      <header className="page-header">
        <p className="eyebrow">About Space Apps · {event.year}</p>
        <h1>A place for curious minds</h1>
        <p>Two days of exploration, collaboration and creation with NASA&apos;s open data.</p>
      </header>
      <section className="content-section prose">
        <h2>What is NASA Space Apps Challenge?</h2>
        <p>NASA Space Apps is an international hackathon led by NASA. People around the world form teams to develop solutions to challenges on Earth and in space, using open data from NASA and its space agency partners.</p>
        <p>The Lucknow event takes place on {event.dates} at {event.venue}, {event.address}. Choose a challenge, work with your team and share what you create over the hackathon weekend.</p>
      </section>
      <section className="content-section">
        <h2>What you can take away</h2>
        <div className="panel-grid">
          {benefits.map(({ title, text, Icon }) => (
            <article className="panel" key={title}><Icon className="panel-icon" size={28} aria-hidden="true" /><h3>{title}</h3><p>{text}</p></article>
          ))}
        </div>
      </section>
      <section className="content-section prose">
        <h2>All streams. All experience levels.</h2>
        <p>School students, college students and curious people from every background are welcome. Science, commerce, humanities and biology students can all take part, along with researchers, artists, designers, storytellers and developers.</p>
        <p>You do not need to know how to code or have attended a hackathon before. Your project could be a website, an app, a scientific model, a research project or a creative way of communicating an idea.</p>
        <p>Teams can have up to {event.teamLimit} members. You can register before finding a team or choosing an idea. Join our community to meet other participants and follow local updates.</p>
      </section>
      <section className="content-section">
        <h2>How to take part</h2>
        <ol className="steps">
          <li><div><h3>Register for Lucknow</h3><p>Create or sign in to your NASA Space Apps account, register for the 2026 challenge and choose the Lucknow local event.</p></div></li>
          <li><div><h3>Explore challenges and find your team</h3><p>Read the official briefs and connect with people whose interests complement yours. Teams can have up to six members.</p></div></li>
          <li><div><h3>Create during the hackathon</h3><p>Work on your solution on 14 and 15 November. You can explore resources beforehand, but project work should begin during the event.</p></div></li>
          <li><div><h3>Submit your project</h3><p>Share your project on your official team page. Eligible projects selected locally may advance for consideration for NASA Space Apps Global Awards.</p></div></li>
        </ol>
      </section>
      <section className="centered-cta">
        <h2>Your perspective belongs here</h2>
        <p>Bring your curiosity. Meet a team. Explore what you can create together.</p>
        <div className="button-group">
          <a href={event.registrationUrl} className="action-link primary">Register now <ArrowUpRight size={18} aria-hidden="true" /></a>
          <Link href="/challenges" className="action-link">Explore challenges <ArrowUpRight size={18} aria-hidden="true" /></Link>
        </div>
      </section>
    </div>
  );
}
