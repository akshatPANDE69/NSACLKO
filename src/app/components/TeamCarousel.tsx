"use client";

import React from "react";
import { event } from "@/lib/event";
import { Linkedin, Github, Twitter, Mail } from "lucide-react";

export interface TeamMember {
  id: number;
  name: string;
  role: string;
  department: string;
  badge: string;
  bio: string;
  specialties: string[];
  socials: {
    linkedin?: string;
    github?: string;
    twitter?: string;
    email?: string;
  };
}

const teamEmail = `mailto:${event.email}`;

/* -------------------------------------------------------------------------- */
/*                               Team Data                                   */
/* -------------------------------------------------------------------------- */
export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: 1,
    name: "Akshat Pande",
    role: "Local Lead & Event Director",
    department: "Core Team",
    badge: "Local Lead",
    bio: "Leading the NASA Space Apps Challenge Lucknow chapter to create high-impact opportunities for students, developers, and space enthusiasts across Uttar Pradesh.",
    specialties: [
      "Mission Strategy",
      "Aerospace Advocacy",
      "Global Coordination",
    ],
    socials: {
      linkedin:
        "https://www.linkedin.com/company/nasa-space-apps-challenge-lucknow",
      email: teamEmail,
    },
  },
  {
    id: 2,
    name: "Ayan Pande",
    role: "Core Lead",
    department: "Core Team",
    badge: "Core Lead",
    bio: "Leading core platform design, digital brand aesthetics, and creative technology for Space Apps Lucknow.",
    specialties: ["UI/UX Design", "Creative Tech", "Brand Strategy"],
    socials: {
      email: teamEmail,
    },
  },
  {
    id: 3,
    name: "Anadi Mishra",
    role: "Core Lead",
    department: "Core Team",
    badge: "Core Lead",
    bio: "Architecting backend systems, technical setup, and participant developer support for the Lucknow hackathon.",
    specialties: ["Systems Architecture", "Cloud Engineering", "DevOps"],
    socials: {
      email: teamEmail,
    },
  },
  {
    id: 4,
    name: "Akash Singh",
    role: "Core Lead",
    department: "Core Team",
    badge: "Core Lead",
    bio: "Directing operational workflows, logistical synchronization, and participant care at SRGI Lucknow.",
    specialties: ["Operations", "Logistics", "Event Execution"],
    socials: {
      email: teamEmail,
    },
  },
  {
    id: 5,
    name: "Aditya Singh",
    role: "Organizing Committee",
    department: "Organizing Committee",
    badge: "OC",
    bio: "Supporting event planning, venue coordination, and participant onboarding.",
    specialties: ["Community Outreach", "Event Coordination"],
    socials: {
      email: teamEmail,
    },
  },
  {
    id: 6,
    name: "Abhinav Pratap Singh",
    role: "Organizing Committee",
    department: "Organizing Committee",
    badge: "OC",
    bio: "Driving attendee engagement, campus ambassador relations, and on‑ground logistics.",
    specialties: ["Campus Outreach", "Logistics"],
    socials: {
      email: teamEmail,
    },
  },
  {
    id: 7,
    name: "Bharat Tiwari",
    role: "Organizing Committee",
    department: "Organizing Committee",
    badge: "OC",
    bio: "Coordinating technical workshops, participant hardware setups, and team collaboration.",
    specialties: ["Technical Support", "Hardware Setup"],
    socials: {
      email: teamEmail,
    },
  },
  {
    id: 8,
    name: "Aishwarya Rai Chauhan",
    role: "Organizing Committee",
    department: "Organizing Committee",
    badge: "OC",
    bio: "Managing communications, content dissemination, and participant assistance.",
    specialties: ["Content Strategy", "Communications"],
    socials: {
      email: teamEmail,
    },
  },
  {
    id: 9,
    name: "Abeer Walia",
    role: "Organizing Committee",
    department: "Organizing Committee",
    badge: "OC",
    bio: "Assisting with youth outreach, school engagement, and registration desks.",
    specialties: ["Youth Outreach", "Registration Operations"],
    socials: {
      email: teamEmail,
    },
  },
  {
    id: 10,
    name: "Srishti Singh",
    role: "Organizing Committee",
    department: "Organizing Committee",
    badge: "OC",
    bio: "Coordinating social media coverage, live event updates, and volunteer synchronization.",
    specialties: ["Social Media", "Volunteer Coordination"],
    socials: {
      email: teamEmail,
    },
  },
  {
    id: 11,
    name: "Aditya Vikram",
    role: "Organizing Committee",
    department: "Organizing Committee",
    badge: "OC",
    bio: "Facilitating participant judging queues, logistics flow, and event hospitality.",
    specialties: ["Event Flow", "Hospitality"],
    socials: {
      email: teamEmail,
    },
  },
  {
    id: 12,
    name: "Naman Chandwani",
    role: "Organizing Committee",
    department: "Organizing Committee",
    badge: "OC",
    bio: "Supporting participant engagement, outreach activities, and on-ground event coordination.",
    specialties: ["Outreach", "Participant Engagement"],
    socials: {
      email: teamEmail,
    },
  },
];

/* -------------------------------------------------------------------------- */
/*                     Helper: Member Image Component                         */
/* -------------------------------------------------------------------------- */
export function TeamMemberImage({
  member,
  size = 64,
}: {
  member?: TeamMember;
  size?: number;
  eager?: boolean;
}) {
  if (!member) return null;

  const parts = member.name.trim().split(/\s+/);
  const initials = `${parts[0]?.[0] ?? ""}${parts.length > 1 ? parts[parts.length - 1][0] : ""}`;

  return (
    <span role="img" aria-label={member.name} className="team-avatar rounded-full"
      style={{ width: size, height: size, fontSize: Math.round(size * .34) }}>{initials}</span>
  );
}

/* -------------------------------------------------------------------------- */
/*                     Helper: Social Links Component                         */
/* -------------------------------------------------------------------------- */
export function TeamSocialLinks({ member }: { member: TeamMember }) {
  const links = [
    {
      href: member.socials.linkedin,
      label: `${member.name} LinkedIn`,
      Icon: Linkedin,
    },
    {
      href: member.socials.github,
      label: `${member.name} GitHub`,
      Icon: Github,
    },
    {
      href: member.socials.twitter,
      label: `${member.name} Twitter`,
      Icon: Twitter,
    },
    {
      href: member.socials.email,
      label: `Email ${member.name}`,
      Icon: Mail,
    },
  ];

  return (
    <div className="team-social-links flex gap-2 mt-2">
      {links.map(
        ({ href, label, Icon }) =>
          href && (
            <a
              key={label}
              href={href}
              aria-label={label}
              {...(!href.startsWith("mailto:") && {
                target: "_blank",
                rel: "noopener noreferrer",
              })}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Icon size={16} aria-hidden="true" />
            </a>
          )
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                     Main Component: Core Team Spotlight                    */
/* -------------------------------------------------------------------------- */
export function Pattern() {
  const coreTeam = TEAM_MEMBERS.filter(
    (member) => member.department === "Core Team"
  );

  return (
    <section className="team-core-spotlight py-8">
      <div className="team-core-grid grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {coreTeam.map((member) => (
          <article
            key={member.id}
            className="team-directory-card team-spotlight-card bg-card rounded-lg p-4 shadow-sm flex flex-col"
          >
            <header className="team-directory-card-header flex items-center gap-4">
              <TeamMemberImage member={member} size={80} eager />
              <div>
                <p className="team-section-label text-sm font-medium text-primary">
                  {member.badge}
                </p>
                <h3 className="text-lg font-semibold">{member.name}</h3>
              </div>
            </header>

            <p className="team-directory-role mt-2 text-sm text-muted-foreground">
              {member.role}
            </p>

            <p className="team-directory-bio mt-2 text-sm">{member.bio}</p>

            <ul
              className="team-specialties mt-3 flex flex-wrap gap-2 text-xs"
              aria-label="Specialties"
            >
              {member.specialties.map((spec) => (
                <li
                  key={spec}
                  className="bg-muted rounded-full px-2 py-0.5"
                >
                  {spec}
                </li>
              ))}
            </ul>

            <TeamSocialLinks member={member} />
          </article>
        ))}
      </div>
    </section>
  );
}

export default Pattern;
