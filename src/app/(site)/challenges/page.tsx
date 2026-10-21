import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, MessageCircle } from "lucide-react";
import { event } from "@/lib/event";
import ChallengeBackground from "@/app/components/ChallengeBackground";
import ChallengesExplorer from "@/app/components/ChallengesExplorer";
import "@/app/styles/challenges.css";

export const metadata: Metadata = { title: "Challenges | NASA Space Apps Lucknow 2026" };

export default function ChallengePage() {
  return (
    <div className="challenges-page">
      <ChallengeBackground />
      <div className="challenge-page-shell">
        <header className="challenge-page-header">
          <p className="challenge-page-eyebrow">NASA Space Apps Challenge / {event.year}</p>
          <h1>Challenges</h1>
          <p className="challenge-page-intro">Start with a question that interests you.<br />See where your perspective can take it.</p>
          <a href="#challenge-catalog" className="hero-btn primary">Explore all {event.year} challenges <ArrowUpRight size={17} aria-hidden="true" /></a>
          <p className="challenge-page-caption">NASA&apos;s open data. Your ideas. Every background welcome.</p>
        </header>

        <ChallengesExplorer />

        <section className="challenge-page-join" aria-labelledby="challenge-join-title">
          <div><p className="challenge-page-eyebrow">You do not need to be a coder</p><h2 id="challenge-join-title">Your skills belong here.</h2><p>Science, commerce, humanities, biology or design. Bring your curiosity and find people to build with.</p></div>
          <div className="challenge-join-actions"><a href={event.registrationUrl} className="hero-btn primary">Register for Lucknow <ArrowUpRight size={17} aria-hidden="true" /></a><a href={event.whatsappUrl} target="_blank" rel="noopener noreferrer" className="challenge-community-link"><MessageCircle size={17} aria-hidden="true" /> Find your team on WhatsApp</a><Link href="/about" className="challenge-about-link">How Space Apps works <ArrowUpRight size={15} aria-hidden="true" /></Link></div>
        </section>
      </div>
    </div>
  );
}
