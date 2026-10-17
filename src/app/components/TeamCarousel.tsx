"use client";

import * as React from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Linkedin, Github, Twitter, Mail } from "lucide-react";

export interface TeamMember {
  id: number
  name: string
  photoUrl?: string
  role: string
  department: string
  badge: string
  bio: string
  specialties: string[]
  quote?: string
  socials: {
    linkedin?: string
    github?: string
    twitter?: string
    email?: string
  }
}

export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: 1,
    name: "Akshat Pande",
    role: "Local Lead & Event Director",
    department: "Executive Committee",
    badge: "Local Lead",
    bio: "Pioneering the NASA Space Apps Challenge Lucknow chapter to create high-impact opportunities for students, developers, and space enthusiasts across Uttar Pradesh. Dedicated to connecting grassroots talent with NASA's open-source science and missions.",
    specialties: ["Mission Strategy", "Aerospace Advocacy", "Global Coordination"],
    quote: "The next frontier of space exploration begins with a curious mind willing to build.",
    socials: {
      linkedin: "https://www.linkedin.com/company/nasa-space-apps-challenge-lucknow",
      github: "https://github.com",
      twitter: "https://twitter.com",
      email: "mailto:spaceappschallenge.lko@gmail.com",
    },
  },
  {
    id: 2,
    name: "Ananya Sharma",
    role: "Technical & Systems Lead",
    department: "Engineering & Dev",
    badge: "Tech Lead",
    bio: "Systems architect and developer leading platform engineering, data APIs, and hackathon technical workshops. Overseeing participant judging portals and open data integration for real-time telemetry datasets.",
    specialties: ["Cloud Architecture", "Data Engineering", "Distributed Systems"],
    quote: "Transforming vast streams of cosmic telemetry into accessible, actionable software.",
    socials: {
      linkedin: "https://linkedin.com",
      github: "https://github.com",
      twitter: "https://twitter.com",
      email: "mailto:spaceappschallenge.lko@gmail.com",
    },
  },
  {
    id: 3,
    name: "Dr. Rohan Verma",
    role: "Scientific Mentor & Astrophysics Lead",
    department: "Research & Mentorship",
    badge: "Scientific Advisor",
    bio: "Astrophysicist and academic mentor guiding participant teams through orbital trajectories, Earth observation analysis, and planetary science challenges. Passionate about empowering multidisciplinary teams.",
    specialties: ["Astrophysics", "Earth Observation", "Orbital Mechanics"],
    quote: "Deep space is not just for astronomers—it is an open workshop for all humanity.",
    socials: {
      linkedin: "https://linkedin.com",
      github: "https://github.com",
      twitter: "https://twitter.com",
      email: "mailto:spaceappschallenge.lko@gmail.com",
    },
  },
  {
    id: 4,
    name: "Ishita Kapoor",
    role: "UI/UX & Creative Director",
    department: "Design & Experience",
    badge: "Design Lead",
    bio: "Crafting the visual identity, interactive web experiences, and aesthetic atmosphere for NASA Space Apps Lucknow. Focuses on intuitive digital tools and immersive cosmic visual design.",
    specialties: ["Design Systems", "Cosmic Aesthetics", "Interface Design"],
    quote: "Great design bridges the gap between complex science and human wonder.",
    socials: {
      linkedin: "https://linkedin.com",
      github: "https://github.com",
      twitter: "https://twitter.com",
      email: "mailto:spaceappschallenge.lko@gmail.com",
    },
  },
  {
    id: 5,
    name: "Kabir Sengupta",
    role: "Community & Outreach Coordinator",
    department: "Outreach & Relations",
    badge: "Community Lead",
    bio: "Building bridges with universities, school STEM clubs, and student tech communities across Lucknow and northern India. Passionate about welcoming first-time hackathon attendees.",
    specialties: ["Community Engagement", "Campus Ambassadors", "Youth Mentorship"],
    quote: "Innovation flourishes when people from every background solve problems together.",
    socials: {
      linkedin: "https://linkedin.com",
      github: "https://github.com",
      twitter: "https://twitter.com",
      email: "mailto:spaceappschallenge.lko@gmail.com",
    },
  },
  {
    id: 6,
    name: "Meera Nair",
    role: "Operations & Logistics Manager",
    department: "Operations & Venue",
    badge: "Operations Lead",
    bio: "Orchestrating 48 hours of seamless hackathon operations at SRGI Lucknow, including participant hospitality, mentor synchronization, judging schedule management, and on-ground logistics.",
    specialties: ["Event Operations", "Logistics Coordination", "Participant Care"],
    quote: "Flawless logistics give hackers the freedom to focus entirely on building the future.",
    socials: {
      linkedin: "https://linkedin.com",
      github: "https://github.com",
      twitter: "https://twitter.com",
      email: "mailto:spaceappschallenge.lko@gmail.com",
    },
  },
]

export function TeamMemberImage({ member, size, eager = false }: { member: TeamMember; size: number; eager?: boolean }) {
  if (member.photoUrl) {
    return <Image className="team-avatar" src={member.photoUrl} alt="" width={size} height={size}
      draggable={false} loading={eager ? "eager" : "lazy"} unoptimized />;
  }
  const names = member.name.replace(/^(Dr\.?|Prof\.?)\s+/i, "").trim().split(/\s+/);
  const initials = `${names[0][0]}${names.length > 1 ? names[names.length - 1][0] : ""}`;
  return <span className="team-avatar team-avatar-placeholder" aria-hidden="true">{initials}</span>;
}

export function TeamSocialLinks({ member }: { member: TeamMember }) {
  const links = [
    { href: member.socials.linkedin, label: `${member.name} LinkedIn`, Icon: Linkedin },
    { href: member.socials.github, label: `${member.name} GitHub`, Icon: Github },
    { href: member.socials.twitter, label: `${member.name} X / Twitter`, Icon: Twitter },
    { href: member.socials.email, label: `Email ${member.name}`, Icon: Mail },
  ];

  return (
    <div className="team-social-links">
      {links.map(({ href, label, Icon }) => href && (
        <a key={label} href={href} aria-label={label}
          {...(!href.startsWith("mailto:") && { target: "_blank", rel: "noopener noreferrer" })}>
          <Icon size={16} aria-hidden="true" />
        </a>
      ))}
    </div>
  );
}

export function Pattern() {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const reducedMotion = useReducedMotion();

  React.useEffect(() => {
    if (!api) return;
    const syncSelection = () => setCurrent(api.selectedScrollSnap());
    syncSelection();
    api.on("select", syncSelection);
    api.on("reInit", syncSelection);
    return () => {
      api.off("select", syncSelection);
      api.off("reInit", syncSelection);
    };
  }, [api]);

  const currentMember = TEAM_MEMBERS[current] || TEAM_MEMBERS[0];

  return (
    <div className="team-spotlight">
      <div className="team-spotlight-grid">
        <div className="team-visual">
          <Carousel setApi={setApi} opts={{ align: "center", loop: true, duration: reducedMotion ? 0 : 25 }}
            className="team-carousel" aria-label="Team member portraits" tabIndex={0}>
            <CarouselContent>
              {TEAM_MEMBERS.map((member, index) => (
                <CarouselItem key={member.id} className="team-slide"
                  aria-label={`${index + 1} of ${TEAM_MEMBERS.length}: ${member.name}`}
                  aria-hidden={index !== current}>
                  <figure className="team-portrait">
                    <TeamMemberImage member={member} size={800} eager={index === 0} />
                    <figcaption>
                      <span>{member.badge}</span>
                      <p>{member.name}</p>
                    </figcaption>
                  </figure>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="team-carousel-controls">
              <p className="team-carousel-count" aria-live="polite" aria-atomic="true">
                <span>{String(current + 1).padStart(2, "0")}</span>
                <span aria-hidden="true"> / </span>
                <span>{String(TEAM_MEMBERS.length).padStart(2, "0")}</span>
              </p>
              <div className="team-arrow-group">
                <CarouselPrevious className="team-carousel-arrow" aria-label="Previous team member" />
                <CarouselNext className="team-carousel-arrow" aria-label="Next team member" />
              </div>
            </div>
          </Carousel>
          <div className="team-carousel-dots" role="group" aria-label="Choose a team member">
            {TEAM_MEMBERS.map((member, index) => (
              <button key={member.id} type="button" onClick={() => api?.scrollTo(index)}
                aria-label={`Jump to team member ${index + 1}`} aria-pressed={current === index}>
                <span />
              </button>
            ))}
          </div>
        </div>

        <div className="team-profile" aria-live="polite" aria-atomic="true">
          <AnimatePresence initial={false} mode="wait">
            <motion.div key={currentMember.id} className="team-member-details"
              initial={reducedMotion ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: reducedMotion ? 1 : 0 }}
              transition={{ duration: reducedMotion ? 0 : 0.2 }}>
              <p className="team-section-label">{currentMember.department}</p>
              <h3>{currentMember.name}</h3>
              <p className="team-member-role">{currentMember.role}</p>
              <p className="team-member-bio">{currentMember.bio}</p>
              {currentMember.quote && <blockquote>{currentMember.quote}</blockquote>}
              <ul className="team-specialties" aria-label="Specialties">
                {currentMember.specialties.map((specialty) => <li key={specialty}>{specialty}</li>)}
              </ul>
              <TeamSocialLinks member={currentMember} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div className="team-member-selector" role="group" aria-label="Select a team member">
        {TEAM_MEMBERS.map((member, index) => (
          <button key={member.id} type="button" onClick={() => api?.scrollTo(index)}
            aria-label={`View ${member.name}`} aria-pressed={index === current}>
            <TeamMemberImage member={member} size={48} />
            <span>{member.name}<small>{member.badge}</small></span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default Pattern;
