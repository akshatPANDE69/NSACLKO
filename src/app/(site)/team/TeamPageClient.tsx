"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, MessageCircle } from "lucide-react";
import { Pattern, TEAM_MEMBERS, TeamSocialLinks } from "@/app/components/TeamCarousel";
import ChallengeBackground from "@/app/components/ChallengeBackground";
import { event } from "@/lib/event";
import "@/app/styles/team.css";

const departments = ["All", ...new Set(TEAM_MEMBERS.map((member) => member.department))];

export default function TeamPageClient() {
  const [department, setDepartment] = useState("All");
  const members = department === "All" ? TEAM_MEMBERS : TEAM_MEMBERS.filter((member) => member.department === department);

  return (
    <div className="team-page">
      <ChallengeBackground />
      <div className="team-shell">
        <header className="team-header">
          <p className="team-eyebrow">NASA Space Apps Challenge / {event.year} / Lucknow</p>
          <h1>Meet our team</h1>
          <p className="team-subtitle">The people bringing Space Apps to Lucknow.<br />Here to help your ideas take shape.</p>
        </header>

        <section className="team-carousel-section" aria-labelledby="team-spotlight-title">
          <div className="team-section-heading">
            <div>
              <p className="team-section-label">Team spotlight</p>
              <h2 id="team-spotlight-title">Core Team &amp; Leadership</h2>
            </div>
            <p className="team-section-note">Explore the core leadership behind the event.</p>
          </div>
          <Pattern />
        </section>

        <section className="team-directory" aria-labelledby="team-directory-title">
          <div className="team-section-heading">
            <div>
              <p className="team-section-label">Crew directory</p>
              <h2 id="team-directory-title">All team members</h2>
            </div>
            <p className="team-result-count" role="status">{members.length} {members.length === 1 ? "member" : "members"}</p>
          </div>
          <div className="team-filters" role="group" aria-label="Filter team by department">
            {departments.map((item) => (
              <button key={item} type="button" aria-pressed={item === department}
                onClick={() => setDepartment(item)}>{item === "All" ? "All departments" : item}</button>
            ))}
          </div>
          <div className="team-directory-grid">
            {members.map((member) => (
              <article key={member.id} className="team-directory-card">
                <div className="team-directory-card-header">
                  <div><p className="team-section-label">{member.badge} · {member.department}</p><h3>{member.name}</h3></div>
                </div>
                <p className="team-directory-role">{member.role}</p>
                <p className="team-directory-bio">{member.bio}</p>
                <ul className="team-specialties" aria-label="Specialties">
                  {member.specialties.map((specialty) => <li key={specialty}>{specialty}</li>)}
                </ul>
                <TeamSocialLinks member={member} />
              </article>
            ))}
          </div>
        </section>

        <section className="team-join" aria-labelledby="team-join-title">
          <div>
            <p className="team-eyebrow">Contribute to Space Apps</p>
            <h2 id="team-join-title">Help ideas take flight.</h2>
            <p>Share your expertise as a mentor or help bring the event to life as a volunteer. Join us on {event.dates} at {event.venue}.</p>
          </div>
          <div className="team-join-actions">
            <Link href="/contact" className="hero-btn primary">Get in touch <ArrowUpRight size={17} aria-hidden="true" /></Link>
            <a href={event.whatsappUrl} target="_blank" rel="noopener noreferrer" className="team-community-link">
              <MessageCircle size={17} aria-hidden="true" /> Join the WhatsApp community
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
