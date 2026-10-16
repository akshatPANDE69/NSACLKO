"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Pattern, TEAM_MEMBERS } from "@/app/components/TeamCarousel";
import { event } from "@/lib/event";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Users,
  ArrowRight,
  Sparkles,
  MessageCircle,
  Mail,
  Linkedin,
  Github,
  Twitter,
} from "lucide-react";
import "@/app/styles/base.css";
import "@/app/styles/team.css";

export default function TeamPageClient() {
  const [filterDepartment, setFilterDepartment] = useState<string>("All");

  const departments = [
    "All",
    "Executive Committee",
    "Engineering & Dev",
    "Research & Mentorship",
    "Design & Experience",
    "Outreach & Relations",
    "Operations & Venue",
  ];

  const filteredMembers =
    filterDepartment === "All"
      ? TEAM_MEMBERS
      : TEAM_MEMBERS.filter((m) => m.department === filterDepartment);

  return (
    <div className="team-page">
      <div className="team-shell">
        {/* Hero Section */}
        <header className="team-header">
          <div className="team-eyebrow">
            NASA SPACE APPS 2026 • LUCKNOW
          </div>
          <h1 className="team-title">MEET OUR TEAM</h1>
          <p className="team-subtitle">
            The organizers, technologists, mentors, and community architects
            dedicating their passion to make NASA Space Apps Challenge Lucknow an
            unforgettable voyage of innovation and discovery.
          </p>
        </header>

        {/* Carousel Spotlight Section */}
        <section className="team-carousel-section" aria-label="Team Spotlight Carousel">
          <div className="team-section-heading">
            <p className="team-section-label">Team Spotlight</p>
            <h2 className="team-section-title">Core Crew &amp; Mentors</h2>
            <p className="text-sm text-gray-400 mt-2 max-w-lg mx-auto">
              Swipe or use the arrows to navigate through the crew. Member biography, role,
              and specializations update dynamically with each slide.
            </p>
          </div>

          {/* The Pattern Carousel Component */}
          <Pattern />
        </section>

        {/* Full Team Directory Grid */}
        <section className="mt-20 pt-12 border-t border-white/10" aria-label="Team Directory">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-cyan-400 mb-2">
                <Users className="w-3.5 h-3.5" />
                <span>Crew Directory</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-light tracking-wide text-white">
                All Team Members
              </h2>
            </div>

            {/* Department Filter Pills */}
            <div className="flex flex-wrap gap-2">
              {departments.map((dept) => {
                const isSelected = filterDepartment === dept;
                return (
                  <button
                    key={dept}
                    type="button"
                    onClick={() => setFilterDepartment(dept)}
                    className={`px-3 py-1.5 rounded-full text-xs font-mono transition-all duration-200 ${
                      isSelected
                        ? "bg-cyan-500 text-black font-semibold shadow-md shadow-cyan-500/20"
                        : "bg-zinc-900/80 border border-white/10 text-gray-400 hover:text-white hover:border-white/30"
                    }`}
                  >
                    {dept}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Directory Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMembers.map((member) => (
              <Card
                key={member.id}
                className="bg-zinc-900/40 border border-white/10 hover:border-cyan-500/40 transition-all duration-300 rounded-2xl overflow-hidden group hover:shadow-xl hover:shadow-cyan-950/20 flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-video overflow-hidden bg-zinc-950">
                    <img
                      src={`https://picsum.photos/800/800?grayscale&random=${member.id}`}
                      alt={member.name}
                      width={600}
                      height={400}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                    <span className="absolute top-3 right-3 text-[10px] font-mono tracking-widest uppercase bg-black/70 backdrop-blur-md text-cyan-300 border border-cyan-500/30 px-2.5 py-1 rounded-full">
                      {member.badge}
                    </span>
                    <div className="absolute bottom-3 left-4 right-4">
                      <p className="text-xs font-mono uppercase tracking-wider text-cyan-400">
                        {member.department}
                      </p>
                      <h3 className="text-xl font-medium text-white truncate">
                        {member.name}
                      </h3>
                    </div>
                  </div>

                  <CardContent className="p-5 space-y-3">
                    <p className="text-sm font-mono text-cyan-300/90 font-medium">
                      {member.role}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-400 line-clamp-3 leading-relaxed">
                      {member.bio}
                    </p>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {member.specialties.map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] font-mono bg-white/5 border border-white/10 px-2.5 py-0.5 rounded-full text-gray-300"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </div>

                <div className="p-5 pt-0 border-t border-white/5 flex items-center justify-between text-xs text-gray-400">
                  <span className="font-mono text-[11px] text-gray-500">
                    NSAC Lucknow 2026
                  </span>
                  <div className="flex items-center gap-3">
                    {member.socials.linkedin && (
                      <a
                        href={member.socials.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-white transition-colors"
                        aria-label={`${member.name} LinkedIn`}
                      >
                        <Linkedin className="w-3.5 h-3.5" />
                      </a>
                    )}
                    {member.socials.github && (
                      <a
                        href={member.socials.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-white transition-colors"
                        aria-label={`${member.name} GitHub`}
                      >
                        <Github className="w-3.5 h-3.5" />
                      </a>
                    )}
                    {member.socials.twitter && (
                      <a
                        href={member.socials.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-white transition-colors"
                        aria-label={`${member.name} Twitter`}
                      >
                        <Twitter className="w-3.5 h-3.5" />
                      </a>
                    )}
                    {member.socials.email && (
                      <a
                        href={member.socials.email}
                        className="hover:text-white transition-colors"
                        aria-label={`Email ${member.name}`}
                      >
                        <Mail className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Join the Team / Mentorship CTA */}
        <section className="mt-24 p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-cyan-950/20 via-zinc-900/40 to-black border border-white/10 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(56,189,248,0.1),transparent_60%)] pointer-events-none" />
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <span className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-cyan-400 bg-cyan-950/60 border border-cyan-800/40 px-3 py-1 rounded-full">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Contribute to Space Apps</span>
            </span>
            <h2 className="text-3xl sm:text-4xl font-light text-white tracking-wide">
              Want to Mentor or Volunteer?
            </h2>
            <p className="text-sm sm:text-base text-gray-300 leading-relaxed font-sans">
              We welcome subject matter experts, industry developers, educators, and enthusiastic
              volunteers to guide hackathon teams and support the Lucknow event on {event.dates} at {event.venue}.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <Button asChild className="bg-cyan-500 hover:bg-cyan-400 text-black font-medium px-6 py-2.5 rounded-full shadow-lg shadow-cyan-500/20">
                <Link href="/contact">
                  Get in Touch <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="border-white/20 hover:border-white text-white hover:bg-white/10 rounded-full px-6 py-2.5">
                <a href={event.whatsappUrl} target="_blank" rel="noopener noreferrer">
                  Join WhatsApp <MessageCircle className="w-4 h-4 ml-1" />
                </a>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
