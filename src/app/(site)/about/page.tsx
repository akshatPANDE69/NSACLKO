import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { event } from "@/lib/event";
import "@/app/styles/about.css";

export const metadata: Metadata = {
  title: "About Space Apps | NASA Space Apps Lucknow 2026",
  description: `Discover NASA Space Apps Challenge in Lucknow. Join us on ${event.dates} at SRGI. All backgrounds and experience levels are welcome.`,
};

const steps = [
  {
    title: "Choose a challenge",
    text: "Explore questions developed by NASA experts, then choose one that interests your team. Start with the challenge brief and its open data.",
  },
  {
    title: "Develop your idea",
    text: "Work together to research, experiment and build. Your project could be an app, a scientific model, a data visualisation or a creative way to explain an idea.",
  },
  {
    title: "Share what you made",
    text: "Present your project and the thinking behind it. Selected local projects can progress to global judging and consideration for Space Apps Global Awards.",
  },
];

export default function About() {
  return (
    <article className="about-container about-editorial" aria-labelledby="about-title">
      <div className="about-layout">
        <header className="about-intro">
          <div>
            <p className="about-kicker">NASA SPACE APPS / LUCKNOW {event.year}</p>
            <h1 id="about-title">About <br />Space Apps</h1>
          </div>
          <div className="about-intro-copy">
            <p className="about-lead">NASA&apos;s global hackathon.<br />A local place to take part.</p>
            <p>NASA International Space Apps Challenge brings people together to explore questions about Earth and space using open data from NASA and its space agency partners. In Lucknow, we&apos;re coming together at SRGI to be part of it.</p>
            <a className="about-text-link" href="https://www.spaceappschallenge.org/about/" target="_blank" rel="noopener noreferrer">About the global programme <ArrowUpRight size={16} aria-hidden="true" /></a>
          </div>
        </header>

        <dl className="about-facts" aria-label="Lucknow event details">
          <div><dt>When</dt><dd>{event.dates}<span>Two days to explore and create</span></dd></div>
          <div><dt>Where</dt><dd>SRGI, Lucknow<span>{event.address}</span></dd></div>
          <div><dt>Your team</dt><dd>Up to {event.teamLimit} people<span>Different skills are welcome</span></dd></div>
        </dl>

        <section className="about-section" aria-labelledby="about-participation-title">
          <div className="about-section-heading">
            <p className="about-kicker">WHO CAN TAKE PART</p>
            <h2 id="about-participation-title">Every background <br />has a place here.</h2>
          </div>
          <div className="about-section-copy">
            <p>You don&apos;t need to know how to code or have a hackathon behind you. School students, college students, professionals and curious beginners can all contribute.</p>
            <p>Science, biology, commerce, humanities, art and design all bring useful perspectives. Researching a question, making sense of data, designing a prototype and telling its story are all part of developing a project.</p>
            <p className="about-school-note">Bringing students from your school or college? <Link href="/contact">Talk to the organising team <ArrowUpRight size={16} aria-hidden="true" /></Link></p>
          </div>
        </section>

        <section className="about-section about-experience" aria-labelledby="about-experience-title">
          <div className="about-section-heading">
            <p className="about-kicker">THE EXPERIENCE</p>
            <h2 id="about-experience-title">What happens <br />over the two days.</h2>
            <Link className="about-text-link" href="/challenges">Explore the challenges <ArrowUpRight size={16} aria-hidden="true" /></Link>
          </div>
          <ol className="about-steps">
            {steps.map((step, index) => (
              <li key={step.title}>
                <span className="about-step-number" aria-hidden="true">0{index + 1}</span>
                <div><h3>{step.title}</h3><p>{step.text}</p></div>
              </li>
            ))}
          </ol>
        </section>

        <section className="about-join" aria-labelledby="about-join-title">
          <div><h2 id="about-join-title">Join us in Lucknow.</h2><p>{event.dates} at {event.venue}.</p></div>
          <div className="about-join-actions">
            <a className="about-register" href={event.registrationUrl}>Register for Space Apps <ArrowUpRight size={18} aria-hidden="true" /></a>
            <a className="about-text-link" href={event.whatsappUrl} target="_blank" rel="noopener noreferrer">Join the WhatsApp community <ArrowUpRight size={16} aria-hidden="true" /></a>
          </div>
        </section>
      </div>
    </article>
  );
}
