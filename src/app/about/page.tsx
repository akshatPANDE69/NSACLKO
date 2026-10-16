'use client';

import Link from 'next/link';
import dynamic from 'next/dynamic';

const DitherOverlay = dynamic(() => import('@/components/DitherOverlay'), { ssr: false });

export default function AboutPage() {
  return (
    <>
      <nav className="igloo-nav">
        <span style={{ fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', opacity: 0.9 }}>
          NSAC <span style={{ opacity: 0.3 }}>//</span> LKO
        </span>
        <div style={{ display: 'flex', gap: '32px' }}>
          <Link href="/about" style={{ opacity: 1, color: '#4488ff' }}>About</Link>
          <Link href="/challenges">Challenges</Link>
          <Link href="/timeline">Timeline</Link>
          <Link href="/contact">Contact</Link>
        </div>
      </nav>
      <DitherOverlay />
      <div className="relative min-h-screen bg-[#0d0d10] text-[#e8e8f0] pt-28 pb-24 px-4 overflow-hidden" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
      {/* Background ambient light */}
      <div className="fixed inset-0 pointer-events-none opacity-20">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-to-b from-cyan-600/20 via-blue-900/10 to-transparent rounded-full blur-[140px]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Header HUD */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-950/20 text-[10px] font-mono uppercase tracking-[0.25em] text-cyan-400 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            MISSION BRIEFING · LUCKNOW 2026 CHAPTER
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white mb-4">
            ABOUT THE <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500">MISSION</span>
          </h1>
          <p className="text-white/50 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
            NASA&apos;s International Space Apps Challenge is the world&apos;s largest annual global hackathon. For 48 hours, citizens worldwide unite to solve real challenges on Earth and in space using NASA&apos;s open data.
          </p>
        </div>

        {/* Global Impact Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {[
            { value: '185+', label: 'Countries & Territories' },
            { value: '93,000+', label: 'Global Innovators' },
            { value: '14', label: '2026 Challenge Tracks' },
            { value: '10', label: 'Global Award Categories' },
          ].map((metric) => (
            <div
              key={metric.label}
              className="p-6 rounded-xl border border-white/10 bg-black/60 backdrop-blur-md text-center"
            >
              <div className="text-3xl md:text-4xl font-mono font-bold text-cyan-400 mb-1">
                {metric.value}
              </div>
              <div className="text-[10px] font-mono uppercase tracking-widest text-white/50">
                {metric.label}
              </div>
            </div>
          ))}
        </div>

        {/* Mission Statement & Lucknow Specifics */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="p-8 rounded-2xl border border-white/10 bg-black/60 backdrop-blur-md space-y-4">
            <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400">
              GLOBAL OBJECTIVE
            </span>
            <h2 className="text-2xl font-bold text-white">
              What is NASA Space Apps?
            </h2>
            <p className="text-white/60 text-xs md:text-sm leading-relaxed">
              Initiated by NASA&apos;s Earth Science Division, the Space Apps Challenge inspires collaboration, creativity, and critical thinking. It fosters interest in Earth and space science and exploration, while providing a global incubator for open-source solutions.
            </p>
            <p className="text-white/60 text-xs md:text-sm leading-relaxed">
              Participants include developers, data scientists, designers, aerospace engineers, students, and enthusiasts collaborating across disciplinary boundaries.
            </p>
          </div>

          <div className="p-8 rounded-2xl border border-cyan-500/30 bg-black/60 backdrop-blur-md space-y-4">
            <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400">
              LOCAL CHAPTER INITIATIVE
            </span>
            <h2 className="text-2xl font-bold text-white">
              The Lucknow Chapter
            </h2>
            <p className="text-white/60 text-xs md:text-sm leading-relaxed">
              Hosted in Lucknow, Uttar Pradesh, the 2026 chapter connects Northern India&apos;s top student developers, researchers, and innovators to NASA&apos;s global network.
            </p>
            <div className="space-y-2 pt-2 text-xs font-mono">
              <div className="flex justify-between border-b border-white/10 pb-1.5">
                <span className="text-white/40 uppercase">FORMAT</span>
                <span className="text-cyan-300">Hybrid (In-Person + Virtual)</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-1.5">
                <span className="text-white/40 uppercase">DATES</span>
                <span className="text-white">November 14–15, 2026</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-1.5">
                <span className="text-white/40 uppercase">REGISTRATION</span>
                <span className="text-green-400">100% Free & Open to All</span>
              </div>
            </div>
          </div>
        </div>

        {/* 4-Stage Mission Flow */}
        <div className="mb-16">
          <div className="text-center mb-10">
            <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400">
              EXECUTION BLUEPRINT
            </span>
            <h2 className="text-3xl font-bold text-white mt-2">
              4-Stage Hackathon Flow
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              {
                step: '01',
                title: 'Challenge Selection',
                desc: 'Review the 14 official challenge tracks released on Oct 28 and identify datasets aligned with your skill set.',
              },
              {
                step: '02',
                title: 'Team Assembly',
                desc: 'Form teams of up to 6 members combining coders, domain specialists, UX designers, and storytellers.',
              },
              {
                step: '03',
                title: '48H Build Sprint',
                desc: 'Hack from Nov 14 09:00 IST to Nov 15 23:59 IST with live mentorship, technical check-ins, and data mining.',
              },
              {
                step: '04',
                title: 'NASA Evaluation',
                desc: 'Submit project code repositories, documentation, and 30-second demos for local awards and global nominations.',
              },
            ].map((card) => (
              <div
                key={card.step}
                className="p-6 rounded-xl border border-white/10 bg-black/50 backdrop-blur-md hover:border-cyan-500/40 transition-colors"
              >
                <div className="text-2xl font-mono font-bold text-cyan-400 mb-2">
                  {card.step}
                </div>
                <h3 className="text-base font-bold text-white mb-2">
                  {card.title}
                </h3>
                <p className="text-xs text-white/60 leading-relaxed">
                  {card.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Core Pillars */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400">
              FOUNDATIONAL VALUES
            </span>
            <h2 className="text-3xl font-bold text-white mt-2">
              Core Mission Pillars
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: 'Open Science',
                desc: 'All solutions are built transparently using freely accessible NASA, ESA, JAXA, and partner satellite datasets.',
              },
              {
                title: 'Global Collaboration',
                desc: 'Cross-cultural teamwork that breaks geographical boundaries to address global challenges collectively.',
              },
              {
                title: 'Tangible Impact',
                desc: 'Projects that address genuine climate emergencies, planetary defense protocols, and space exploration frontiers.',
              },
            ].map((pillar) => (
              <div
                key={pillar.title}
                className="p-6 rounded-xl border border-white/10 bg-black/60 backdrop-blur-md text-center"
              >
                <h3 className="text-lg font-bold text-cyan-300 mb-2">
                  {pillar.title}
                </h3>
                <p className="text-xs text-white/60 leading-relaxed">
                  {pillar.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Banner */}
        <div className="p-8 rounded-2xl border border-cyan-500/30 bg-gradient-to-b from-cyan-950/20 to-black/60 backdrop-blur-md text-center">
          <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 mb-2 block">
            LUCKNOW CHAPTER · NOVEMBER 14–15, 2026
          </span>
          <h2 className="text-3xl font-bold text-white mb-4">
            Join the World&apos;s Largest Space Hackathon
          </h2>
          <p className="text-white/60 text-xs md:text-sm max-w-md mx-auto mb-6">
            Free registration. Open to beginners and seasoned engineers alike. Claim your spot on the official NASA roster.
          </p>
          <a
            href="https://www.spaceappschallenge.org/2026/local-events/lucknow/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3.5 text-xs font-bold uppercase tracking-widest text-black bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 rounded-lg shadow-[0_0_25px_rgba(0,240,255,0.4)] transition-all"
          >
            REGISTER ON OFFICIAL PORTAL ↗
          </a>
        </div>
      </div>
      </div>
    </>
  );
}
