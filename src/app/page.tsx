import Link from "next/link";
import { ArrowDown, ArrowUpRight, CalendarDays, MapPin, MessageCircle, Users, Lightbulb, Telescope, Globe2, Sparkles } from "lucide-react";
import { event } from "@/lib/event";
import Earth from "./components/Earth";

const benefits = [
  { number: "01", title: "Follow your curiosity", text: "Explore NASA’s open data and take on a real challenge facing Earth or space.", Icon: Telescope },
  { number: "02", title: "Find your people", text: "Bring different perspectives together. Research, business, biology, design and code all have a place.", Icon: Users },
  { number: "03", title: "Make something matter", text: "Turn an idea into a project, share your work and take home skills that go beyond the classroom.", Icon: Lightbulb },
];

export default function Home() {
  return (
    <div className="home-page">
      <section className="home-hero" id="home" aria-labelledby="hero-title">
        <div className="hero-stars" aria-hidden="true" />
        <div className="hero-topline"><p>LUCKNOW, INDIA <span>/</span> {event.year} EDITION</p><span className="registration-status"><span /> Registrations open</span></div>
        <div className="hero-main">
          <div className="home-hero-content">
            <p className="eyebrow">NASA Space Apps Challenge {event.year}</p>
            <h1 id="hero-title">Think beyond.<br /><span>Build for Earth.</span></h1>
            <p className="home-hero-description">Big questions need different minds. Explore NASA&apos;s open data and turn your curiosity into a solution, right here in Lucknow.</p>
            <div className="hero-event-date"><CalendarDays size={17} aria-hidden="true" /><span>{event.dates}</span><span className="hero-date-divider" /><span>SRGI, Lucknow</span></div>
            <div className="button-group hero-actions">
              <a href={event.registrationUrl} className="action-link primary">Register for Lucknow <ArrowUpRight size={19} aria-hidden="true" /></a>
              <a href={event.whatsappUrl} className="hero-explore" target="_blank" rel="noopener noreferrer"><MessageCircle size={17} aria-hidden="true" /> Join WhatsApp</a>
            </div>
            <p className="hero-welcome"><Sparkles size={15} aria-hidden="true" /> All streams welcome. No coding experience needed.</p>
          </div>
          <Earth />
        </div>
        <div className="hero-bottomline"><span>{event.theme}</span><span>One global challenge. Your local community.</span><a href="#about" aria-label="Scroll to about the event"><ArrowDown size={18} aria-hidden="true" /></a></div>
        <a href={event.whatsappUrl} className="hero-community" target="_blank" rel="noopener noreferrer">
          <span className="community-icon"><MessageCircle size={23} aria-hidden="true" /></span>
          <span className="community-copy"><span>Great ideas start with a conversation.</span><span>Join our WhatsApp community for updates, questions and finding your team.</span></span>
          <span className="community-cta">Join WhatsApp <ArrowUpRight size={20} aria-hidden="true" /></span>
        </a>
      </section>

      <section className="event-facts" aria-label="Event at a glance">
        <div><CalendarDays aria-hidden="true" /><p><span>The weekend</span>14 &amp; 15 November 2026</p></div>
        <div><MapPin aria-hidden="true" /><p><span>The place</span>{event.venue}, Lucknow</p></div>
        <div><Users aria-hidden="true" /><p><span>The people</span>Teams of up to {event.teamLimit}. Every background.</p></div>
      </section>

      <section id="about" className="home-about" aria-labelledby="about-title">
        <div className="home-section-heading">
          <p className="eyebrow">Your perspective belongs here</p>
          <h2 id="about-title">Curiosity is the<br />only prerequisite.</h2>
          <div className="section-copy"><p>A two day international hackathon. Real challenges. NASA&apos;s open data. A room full of people who see things differently.</p><p>Whether you study science, commerce, humanities or biology, this is your space to explore, collaborate and create.</p><Link href="/about" className="text-link">Get to know Space Apps <ArrowUpRight size={18} aria-hidden="true" /></Link></div>
        </div>
        <div className="benefit-grid">{benefits.map(({ number, title, text, Icon }) => <article className="benefit" key={number}><div className="benefit-top"><span>{number}</span><Icon size={25} aria-hidden="true" /></div><h3>{title}</h3><p>{text}</p></article>)}</div>
      </section>

      <section className="home-challenges" aria-labelledby="challenges-title">
        <div className="challenge-heading"><div><p className="eyebrow">A starting point for every mind</p><h2 id="challenges-title">Different skills.<br /><span>Shared discoveries.</span></h2></div><Link href="/challenges" className="action-link">Explore the challenges <ArrowUpRight size={18} aria-hidden="true" /></Link></div>
        <div className="discovery-grid">
          <Link href="/challenges" className="discovery-card"><Globe2 size={33} aria-hidden="true" /><span className="discovery-index">01 / Earth</span><h3>A better view<br />of our planet.</h3><p>Climate, oceans, biodiversity and the world we call home.</p><span className="discovery-link">Explore Earth science <ArrowUpRight size={20} aria-hidden="true" /></span></Link>
          <Link href="/challenges" className="discovery-card"><Telescope size={33} aria-hidden="true" /><span className="discovery-index">02 / Space</span><h3>Questions beyond<br />the horizon.</h3><p>Space exploration, astronomy and a universe to understand.</p><span className="discovery-link">Explore space <ArrowUpRight size={20} aria-hidden="true" /></span></Link>
          <Link href="/challenges" className="discovery-card"><Lightbulb size={33} aria-hidden="true" /><span className="discovery-index">03 / Possibility</span><h3>New ways to<br />tell the story.</h3><p>Research, design and creative ideas that make science accessible.</p><span className="discovery-link">Find your approach <ArrowUpRight size={20} aria-hidden="true" /></span></Link>
        </div>
        <p className="challenge-note">Explore these areas of interest, then choose your project from the official 2026 challenge briefs.</p>
      </section>

      <section className="home-join">
        <div><p className="eyebrow">Your next idea starts here</p><h2>Two days.<br />A whole new perspective.</h2><p>No team or project idea yet? Start with curiosity. Find your people along the way.</p></div>
        <div className="join-actions"><a href={event.registrationUrl} className="action-link primary">Register for Lucknow <ArrowUpRight size={20} aria-hidden="true" /></a><Link href="/timeline" className="text-link">See the 2026 timeline <ArrowUpRight size={17} aria-hidden="true" /></Link></div>
      </section>
    </div>
  );
}
