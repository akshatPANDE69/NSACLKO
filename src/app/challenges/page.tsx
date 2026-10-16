'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

const DitherOverlay = dynamic(() => import('@/components/DitherOverlay'), { ssr: false });

type Complexity = 'Open to All' | 'Intermediate' | 'Advanced';

interface Challenge {
  id: number;
  title: string;
  category: string;
  complexity: Complexity;
  tools: string[];
  description: string;
}

const CHALLENGES: Challenge[] = [
  {
    id: 1,
    title: 'Earth Observation & Climate Intelligence',
    category: 'Earth Science & Climate',
    complexity: 'Open to All',
    tools: ['NASA Earthdata', 'Sentinel-2', 'Python', 'GIS'],
    description: 'Use real-time satellite imagery and environmental data to detect anomalies, microclimate shifts, and agricultural vulnerabilities.',
  },
  {
    id: 2,
    title: 'Planetary Rover Autonomous Pathfinding',
    category: 'Planetary & Lunar Exploration',
    complexity: 'Advanced',
    tools: ['NASA SPICE', 'WebGL', 'Three.js', 'PyTorch'],
    description: 'Build trajectory computation and obstacle avoidance algorithms for robotic explorers navigating rugged lunar or Martian surfaces.',
  },
  {
    id: 3,
    title: 'Deep Space Optical Communications Dashboard',
    category: 'Astrophysics & Deep Space',
    complexity: 'Intermediate',
    tools: ['DSN Telemetry', 'Next.js', 'WebSockets'],
    description: 'Design a high-bandwidth visualization tool for NASA Deep Space Network laser communication downlinks from interplanetary spacecraft.',
  },
  {
    id: 4,
    title: 'Near-Earth Asteroid Impact Risk Analyzer',
    category: 'Astrophysics & Deep Space',
    complexity: 'Advanced',
    tools: ['NASA JPL CNEOS API', 'Python', 'NumPy'],
    description: 'Calculate orbital trajectories and probability envelopes for newly cataloged asteroids approaching Earth within 0.05 AU.',
  },
  {
    id: 5,
    title: 'Solar Storm & Auroral Forecast Engine',
    category: 'Heliophysics & Space Weather',
    complexity: 'Intermediate',
    tools: ['SDO & SOHO Feeds', 'FastAPI', 'Plotly'],
    description: 'Correlate coronal mass ejections with geomagnetic field disturbances to provide early warning metrics for power grids and satellites.',
  },
  {
    id: 6,
    title: 'Exoplanet Atmospheric Spectral Decomposition',
    category: 'AI & Astroinformatics',
    complexity: 'Advanced',
    tools: ['JWST & Kepler Archive', 'SciPy', 'PyTorch'],
    description: 'Train neural classifiers on transmission spectroscopy data to identify water vapor, methane, and bio-signature traces in distant exoplanets.',
  },
  {
    id: 7,
    title: 'Wildfire Progression & Smoke Dispersion Tracker',
    category: 'Earth Science & Climate',
    complexity: 'Open to All',
    tools: ['FIRMS Active Fire API', 'Mapbox GL', 'React'],
    description: 'Leverage NASA MODIS and VIIRS thermal telemetry to map rapid wildfire spread and forecast hazardous PM2.5 atmospheric drift.',
  },
  {
    id: 8,
    title: 'Microgravity Biological Experiment Telemetry',
    category: 'Planetary & Lunar Exploration',
    complexity: 'Intermediate',
    tools: ['GeneLab Database', 'Python', 'Pandas'],
    description: 'Analyze genomic and physiological adaptation datasets from ISS rodent and plant habitats exposed to long-duration cosmic radiation.',
  },
  {
    id: 9,
    title: 'Space Debris Orbit Evolution & Collision Avoidance',
    category: 'AI & Astroinformatics',
    complexity: 'Advanced',
    tools: ['Space-Track API', 'Python', 'Scikit-learn'],
    description: 'Model low-Earth orbit debris fields and compute conjunction data messages (CDMs) to automate collision avoidance burns.',
  },
  {
    id: 10,
    title: 'Lunar South Pole Volatile & Water Ice Mapping',
    category: 'Planetary & Lunar Exploration',
    complexity: 'Intermediate',
    tools: ['LRO LOLA Data', 'QGIS', 'WebGL'],
    description: 'Process permanently shadowed crater thermal profiles from the Lunar Reconnaissance Orbiter to pinpoint harvestable water-ice deposits.',
  },
  {
    id: 11,
    title: 'Interactive 3D Solar System Orrery for Classrooms',
    category: 'Open Science & Education',
    complexity: 'Open to All',
    tools: ['NASA Horizons API', 'Three.js', 'Canvas'],
    description: 'Create an engaging, mathematically accurate 3D planetary browser app that lets students explore mission trajectories in real time.',
  },
  {
    id: 12,
    title: 'Astronaut Ergonomics & Habitat Acoustic Analysis',
    category: 'Planetary & Lunar Exploration',
    complexity: 'Intermediate',
    tools: ['ISS Acoustic Data', 'Web Audio API', 'React'],
    description: 'Design acoustic dampening recommendations and spatial layout optimizations for deep space transit habitat modules.',
  },
  {
    id: 13,
    title: 'Ocean Salinity & Sea Surface Heat Flux Monitor',
    category: 'Earth Science & Climate',
    complexity: 'Intermediate',
    tools: ['PO.DAAC Data', 'xarray', 'D3.js'],
    description: 'Synthesize oceanographic satellite readings to measure global heat redistribution and marine heatwave development.',
  },
  {
    id: 14,
    title: 'Open Source Space Hardware Citizen Science Kit',
    category: 'Open Science & Education',
    complexity: 'Open to All',
    tools: ['KiCad', 'Arduino', 'NASA 3D Resources'],
    description: 'Draft open-source schematics and software for low-cost ground stations capable of receiving direct NOAA weather satellite passes.',
  },
];

const CATEGORIES = [
  'All',
  'Earth Science & Climate',
  'Planetary & Lunar Exploration',
  'Astrophysics & Deep Space',
  'Heliophysics & Space Weather',
  'AI & Astroinformatics',
  'Open Science & Education',
];

const COMPLEXITIES: (Complexity | 'All')[] = ['All', 'Open to All', 'Intermediate', 'Advanced'];

export default function ChallengesPage() {
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [complexityFilter, setComplexityFilter] = useState<string>('All');

  const filteredChallenges = useMemo(() => {
    return CHALLENGES.filter((c) => {
      const catMatch = categoryFilter === 'All' || c.category === categoryFilter;
      const compMatch = complexityFilter === 'All' || c.complexity === complexityFilter;
      return catMatch && compMatch;
    });
  }, [categoryFilter, complexityFilter]);

  return (
    <>
      <nav className="igloo-nav">
        <span style={{ fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', opacity: 0.9 }}>
          NSAC <span style={{ opacity: 0.3 }}>//</span> LKO
        </span>
        <div style={{ display: 'flex', gap: '32px' }}>
          <Link href="/about">About</Link>
          <Link href="/challenges" style={{ opacity: 1, color: '#4488ff' }}>Challenges</Link>
          <Link href="/timeline">Timeline</Link>
          <Link href="/contact">Contact</Link>
        </div>
      </nav>
      <DitherOverlay />
      <div className="relative min-h-screen bg-[#0d0d10] text-[#e8e8f0] pt-28 pb-24 px-4 overflow-hidden" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none opacity-25">
        <div className="absolute top-20 right-1/4 w-[600px] h-[600px] bg-gradient-to-b from-cyan-600/20 to-blue-800/10 rounded-full blur-[140px]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header HUD */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-950/20 text-[10px] font-mono uppercase tracking-[0.25em] text-cyan-400 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            14 ACTIVE CHALLENGE TRACKS · 2026 EDITION
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white mb-4">
            CHALLENGE <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500">DATABASE</span>
          </h1>
          <p className="text-white/50 text-sm md:text-base max-w-2xl mx-auto leading-relaxed mb-6">
            Full challenge statements release on October 28, 2026. Review the tracks below, explore official NASA open datasets, and prepare your team for the November 14–15 sprint in Lucknow.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="https://www.spaceappschallenge.org/2026/challenges/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 text-xs font-bold uppercase tracking-widest text-black bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 rounded-lg shadow-[0_0_20px_rgba(0,240,255,0.4)] transition-all"
            >
              OFFICIAL NASA CHALLENGES PORTAL ↗
            </a>
            <a
              href="https://www.spaceappschallenge.org/2026/local-events/lucknow/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 text-xs font-mono uppercase tracking-widest text-cyan-300 border border-cyan-500/30 hover:border-cyan-400 rounded-lg transition-all"
            >
              REGISTER FOR LUCKNOW CHAPTER
            </a>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="p-4 md:p-6 rounded-xl border border-white/10 bg-black/60 backdrop-blur-md mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-cyan-400/80 mb-2">
              Filter by Domain Track
            </label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full bg-[#000814] border border-cyan-500/30 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-cyan-400/80 mb-2">
              Filter by Complexity
            </label>
            <select
              value={complexityFilter}
              onChange={(e) => setComplexityFilter(e.target.value)}
              className="w-full bg-[#000814] border border-cyan-500/30 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
            >
              {COMPLEXITIES.map((comp) => (
                <option key={comp} value={comp}>
                  {comp}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Challenge Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredChallenges.map((challenge) => (
            <div
              key={challenge.id}
              className="p-6 rounded-xl border border-white/10 bg-black/50 backdrop-blur-md hover:border-cyan-500/40 hover:bg-black/80 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[9px] font-mono uppercase tracking-widest text-cyan-400 px-2 py-0.5 rounded border border-cyan-500/30 bg-cyan-950/30">
                    TRACK #{challenge.id < 10 ? `0${challenge.id}` : challenge.id}
                  </span>
                  <span className="text-[9px] font-mono uppercase tracking-wider text-white/50">
                    {challenge.complexity}
                  </span>
                </div>

                <div className="text-[10px] font-mono uppercase tracking-widest text-white/40 mb-1">
                  {challenge.category}
                </div>

                <h3 className="text-base font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                  {challenge.title}
                </h3>

                <p className="text-xs text-white/60 leading-relaxed mb-4">
                  {challenge.description}
                </p>
              </div>

              <div>
                <div className="text-[10px] font-mono uppercase tracking-wider text-cyan-500/60 mb-1.5">
                  RECOMMENDED TOOLING
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {challenge.tools.map((tool) => (
                    <span
                      key={tool}
                      className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-white/70"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredChallenges.length === 0 && (
          <div className="text-center py-16 p-8 rounded-xl border border-white/10 bg-black/40">
            <p className="text-sm font-mono text-cyan-400/80">
              NO CHALLENGES FOUND MATCHING THE ACTIVE FILTERS.
            </p>
          </div>
        )}
      </div>
      </div>
    </>
  );
}
