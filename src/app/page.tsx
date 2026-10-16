'use client';

import Link from 'next/link';
import dynamic from 'next/dynamic';

const IglooScene = dynamic(() => import('@/components/IglooScene'), { ssr: false });
const DitherOverlay = dynamic(() => import('@/components/DitherOverlay'), { ssr: false });

const challenges = [
  'Atmosphere & Climate',
  'Land & Ecosystems',
  'Ocean & Water',
  'Celestial Navigation',
  'Space Exploration',
  'Human Habitation',
];

export default function Page() {
  return (
    <div style={{ background: '#0d0d10', minHeight: '100vh', fontFamily: "'IBM Plex Mono', monospace", color: '#e8e8f0' }}>

      {/* Fixed 3D Canvas */}
      <IglooScene />

      {/* Bayer dither film grain */}
      <DitherOverlay />

      {/* ── Navigation ── */}
      <nav className="igloo-nav">
        <span style={{ fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', opacity: 0.9 }}>
          NSAC <span style={{ opacity: 0.3 }}>//</span> LKO
        </span>
        <div style={{ display: 'flex', gap: '32px' }}>
          <Link href="/about">About</Link>
          <Link href="/challenges">Challenges</Link>
          <Link href="/timeline">Timeline</Link>
          <Link href="/contact">Contact</Link>
        </div>
      </nav>

      {/* ── Hero overlay (sits above 3D canvas) ── */}
      <div className="igloo-hero">
        <p className="igloo-subtitle" style={{ marginBottom: '4px' }}>
          NASA Space Apps Challenge 2026
        </p>
        <h1 className="igloo-title">
          HACK THE<br />UNIVERSE
        </h1>
        <p style={{
          fontSize: '11px',
          color: '#555570',
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          marginTop: '20px',
          lineHeight: '1.9',
        }}>
          Lucknow&nbsp;&nbsp;·&nbsp;&nbsp;November 14–15&nbsp;&nbsp;·&nbsp;&nbsp;48h Sprint
        </p>
        <div style={{ display: 'flex', gap: '14px', marginTop: '32px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <a
            href="https://www.spaceappschallenge.org/2026/local-events/lucknow/"
            target="_blank"
            rel="noopener noreferrer"
            className="igloo-btn primary"
          >
            Register Free
          </a>
          <Link href="/challenges" className="igloo-btn">
            Explore Challenges
          </Link>
        </div>
      </div>

      {/* ── Bottom HUD ── */}
      <div className="igloo-hud">
        <span>185+ Countries</span>
        <span className="igloo-hud-divider" />
        <span>93K+ Participants</span>
        <span className="igloo-hud-divider" />
        <span>Nov 14–15 · Lucknow</span>
        <span className="igloo-hud-divider" />
        <span>48h Hackathon</span>
        <span className="igloo-hud-divider" />
        <span style={{ color: '#4488ff' }}>Free to Join</span>
      </div>

      {/* ── Scroll body (below fixed hero) ── */}
      <div style={{ paddingTop: '100vh', position: 'relative', zIndex: 5 }}>

        {/* About */}
        <section className="igloo-section" style={{ background: '#0d0d10' }}>
          <p className="igloo-subtitle">About</p>
          <h2 className="igloo-section-title">
            The world's largest annual global space hackathon
          </h2>
          <p className="igloo-section-body">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
            tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
            quis nostrud exercitation ullamco laboris.
          </p>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3,1fr)',
            gap: '1px',
            background: 'rgba(255,255,255,0.06)',
            maxWidth: '640px',
            width: '100%',
            marginTop: '20px',
          }}>
            {[['185+', 'Countries'], ['93K+', 'Innovators'], ['48h', 'Sprint']].map(([val, label]) => (
              <div key={label} style={{
                background: '#0d0d10',
                padding: '32px 20px',
                textAlign: 'center',
              }}>
                <div style={{ fontSize: 'clamp(24px,4vw,40px)', fontWeight: 700, color: '#4488ff', letterSpacing: '-0.02em' }}>{val}</div>
                <div style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#555570', marginTop: '8px' }}>{label}</div>
              </div>
            ))}
          </div>
        </section>

        <hr className="igloo-divider" />

        {/* Challenges */}
        <section className="igloo-section" style={{ background: '#111118' }}>
          <p className="igloo-subtitle">Challenges</p>
          <h2 className="igloo-section-title">
            Solve problems that matter across Earth and space
          </h2>
          <p className="igloo-section-body">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim
            veniam, quis nostrud exercitation. Duis aute irure dolor in reprehenderit.
          </p>
          <div className="igloo-grid">
            {challenges.map((name, i) => (
              <div key={i} className="igloo-grid-cell">
                <div style={{ fontSize: '9px', color: '#4488ff', marginBottom: '10px', letterSpacing: '0.15em' }}>
                  0{i + 1}
                </div>
                {name}
              </div>
            ))}
          </div>
          <Link href="/challenges" className="igloo-btn" style={{ marginTop: '48px', textDecoration: 'none' }}>
            View All Challenges →
          </Link>
        </section>

        <hr className="igloo-divider" />

        {/* Timeline teaser */}
        <section className="igloo-section" style={{ background: '#0d0d10' }}>
          <p className="igloo-subtitle">Timeline</p>
          <h2 className="igloo-section-title">
            Key dates and milestones
          </h2>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1px',
            background: 'rgba(255,255,255,0.06)',
            maxWidth: '640px',
            width: '100%',
            marginTop: '24px',
          }}>
            {[
              ['Registration Opens', 'Now Open'],
              ['Challenges Released', 'Oct 2026'],
              ['Event Kickoff', 'Nov 14, 2026'],
              ['Submission Deadline', 'Nov 15, 2026'],
            ].map(([event, date]) => (
              <div key={event} style={{
                background: '#0d0d10',
                padding: '20px 28px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '11px',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
              }}>
                <span style={{ color: '#555570' }}>{event}</span>
                <span style={{ color: '#4488ff' }}>{date}</span>
              </div>
            ))}
          </div>
          <Link href="/timeline" className="igloo-btn" style={{ marginTop: '40px', textDecoration: 'none' }}>
            Full Timeline →
          </Link>
        </section>

        <hr className="igloo-divider" />

        {/* Register CTA */}
        <section className="igloo-section" style={{ background: '#111118' }}>
          <p className="igloo-subtitle">Register</p>
          <h2 className="igloo-section-title">Join the mission</h2>
          <p className="igloo-section-body">
            Lorem ipsum dolor sit amet. Registration is free and open to everyone —
            students, professionals, and curious minds.
          </p>
          <a
            href="https://www.spaceappschallenge.org/2026/local-events/lucknow/"
            target="_blank"
            rel="noopener noreferrer"
            className="igloo-btn primary"
            style={{ marginTop: '16px', padding: '18px 56px', fontSize: '12px' }}
          >
            Register Now — It's Free
          </a>
        </section>

        {/* Footer */}
        <footer style={{
          borderTop: '1px solid rgba(255,255,255,0.06)',
          padding: '32px 40px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '10px',
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          color: '#555570',
          background: '#0d0d10',
        }}>
          <span>NSAC // LKO © 2026</span>
          <span>Lucknow · India</span>
          <a
            href="https://www.spaceappschallenge.org/2026/local-events/lucknow/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#4488ff', textDecoration: 'none', opacity: 0.7 }}
          >
            NASA Space Apps ↗
          </a>
        </footer>
      </div>
    </div>
  );
}