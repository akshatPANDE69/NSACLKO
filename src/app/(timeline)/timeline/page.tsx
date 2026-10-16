'use client';

import Link from 'next/link';
import dynamic from 'next/dynamic';
import { FC } from 'react';

const DitherOverlay = dynamic(() => import('@/components/DitherOverlay'), { ssr: false });

type Event = {
  phase: string;
  date: string;
  title: string;
  description: string;
  status?: string;
};

const events: Event[] = [
  {
    phase: 'PHASE 01',
    date: 'Aug 26, 2026',
    title: 'Registration Opens',
    description: 'Kick‑off the journey – sign up individually or as a team.',
    status: 'Completed',
  },
  {
    phase: 'PHASE 02',
    date: 'Sep 17, 2026',
    title: 'Team Formation & Challenge Summaries',
    description: 'Form your crew and explore the challenge briefs.',
    status: 'Active',
  },
  {
    phase: 'PHASE 03',
    date: 'Oct 28, 2026',
    title: 'Full Challenge Statements Released',
    description: 'Access the full problem statements from NASA and partners.',
    status: 'Upcoming',
  },
  {
    phase: 'PHASE 04',
    date: 'Nov 3, 2026',
    title: 'Space Apps Connect Chat Platform Opens',
    description: 'Collaborate with mentors, peers, and experts in real‑time.',
    status: 'Upcoming',
  },
  {
    phase: 'PHASE 05',
    date: 'Nov 13, 2026',
    title: 'Global Collaborator Offers Available',
    description: 'Explore exclusive resources and incentives from our partners.',
    status: 'Upcoming',
  },
  {
    phase: 'PHASE 06',
    date: 'Nov 14–15, 2026',
    title: 'Hackathon Weekend - 48-Hour Global Hackathon (Starts Nov 14 at 9:00 AM Local)',
    description: 'Build, test, and iterate on your solution in a live hackathon.',
    status: 'Upcoming',
  },
  {
    phase: 'PHASE 07',
    date: 'Nov 15, 2026',
    title: 'Project Submission Deadline - 11:59 PM Local Time',
    description: 'Submit your final project for judging.',
    status: 'Upcoming',
  },
  {
    phase: 'PHASE 08',
    date: 'Nov 30, 2026',
    title: 'Participant Survey Deadline',
    description: 'Share your feedback and help shape the future of Space Apps.',
    status: 'Upcoming',
  },
  {
    phase: 'PHASE 09',
    date: 'Dec 2026',
    title: 'Global Nominees, Finalists & Honorable Mentions',
    description: 'Top projects move forward to the global stage.',
    status: 'Upcoming',
  },
  {
    phase: 'PHASE 10',
    date: 'Jan 2027',
    title: 'NASA Global Winners Announcement',
    description: 'Celebrate the winners and their impact on space innovation.',
    status: 'Upcoming',
  },
];

const EventCard: FC<Event> = ({ phase, date, title, description, status }) => (
  <div className="border border-[rgba(255,255,255,0.08)] bg-[#111118] rounded-lg p-6 flex flex-col gap-2">
    <div className="flex items-center gap-3">
      <span className="text-xs font-mono text-[#4488ff] opacity-80">[{phase}]</span>
      <span className="text-sm font-medium">{date}</span>
      {status && (
        <span className="ml-auto text-xs font-mono uppercase px-2 py-0.5 bg-[#4488ff] bg-opacity-20 text-[#4488ff] rounded">
          {status}
        </span>
      )}
    </div>
    <h3 className="text-lg font-semibold">{title}</h3>
    <p className="text-sm opacity-80">{description}</p>
  </div>
);

export default function TimelinePage() {
  return (
    <>
      {/* Top navigation */}
      <nav className="igloo-nav flex items-center justify-between px-8 py-4 bg-[#0d0d10]">
        <span
          style={{
            fontSize: '11px',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            opacity: 0.9,
          }}
        >
          NSAC <span style={{ opacity: 0.3 }}>//</span> LKO
        </span>
        <div style={{ display: 'flex', gap: '32px' }}>
          <Link href="/about">About</Link>
          <Link href="/challenges">Challenges</Link>
          <Link href="/timeline" style={{ opacity: 1, color: '#4488ff' }}>
            Timeline
          </Link>
          <Link href="/contact">Contact</Link>
        </div>
      </nav>

      {/* Dither overlay */}
      <DitherOverlay />

      {/* Main container */}
      <section
        className="min-h-screen pt-28 pb-24"
        style={{
          background: '#0d0d10',
          color: '#e8e8f0',
          fontFamily: `'IBM Plex Mono', monospace`,
        }}
      >
        <div className="max-w-5xl mx-auto px-6">
          {/* Header */}
          <header className="mb-12 text-center">
            <p className="text-sm uppercase opacity-70 tracking-widest mb-2">
              MISSION ROADMAP // 2026
            </p>
            <h1 className="text-4xl font-bold mb-4">TIMELINE</h1>
            <p className="text-base opacity-80 max-w-2xl mx-auto">
              Follow the key milestones of the NASA Space Apps Challenge Lucknow 2026. Under the theme &quot;The Next Frontier&quot;, every step is designed to inspire innovation and collaboration.
            </p>
          </header>

          {/* Events grid */}
          <div className="grid gap-6 md:grid-cols-2">
            {events.map((ev) => (
              <EventCard key={ev.phase} {...ev} />
            ))}
          </div>

          {/* CTA */}
          <div className="mt-16 text-center">
            <Link
              href="https://www.spaceappschallenge.org/2026/local-events/lucknow/" target="_blank" rel="noopener noreferrer"
              className="igloo-btn primary inline-block px-8 py-3 text-lg font-medium"
            >
              Register Now
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
