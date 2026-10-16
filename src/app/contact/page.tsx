'use client';

import { useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

const DitherOverlay = dynamic(() => import('@/components/DitherOverlay'), { ssr: false });

export default function ContactPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    role: '',
    message: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle');

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!form.name.trim()) newErrors.name = 'CALLSIGN / NAME REQUIRED';
    if (!form.email.trim() || !form.email.includes('@')) newErrors.email = 'VALID COMMS EMAIL REQUIRED';
    if (!form.message.trim()) newErrors.message = 'TRANSMISSION PAYLOAD CANNOT BE EMPTY';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setStatus('sending');
    setTimeout(() => {
      setStatus('sent');
      setTimeout(() => {
        setForm({ name: '', email: '', role: '', message: '' });
        setStatus('idle');
      }, 4000);
    }, 1200);
  };

  return (
    <>
      <nav className="igloo-nav">
        <span style={{ fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', opacity: 0.9 }}>
          NSAC <span style={{ opacity: 0.3 }}>//</span> LKO
        </span>
        <div style={{ display: 'flex', gap: '32px' }}>
          <Link href="/about">About</Link>
          <Link href="/challenges">Challenges</Link>
          <Link href="/timeline">Timeline</Link>
          <Link href="/contact" style={{ opacity: 1, color: '#4488ff' }}>Contact</Link>
        </div>
      </nav>
      <DitherOverlay />
      <div className="relative min-h-screen bg-[#0d0d10] text-[#e8e8f0] pt-28 pb-24 px-4 overflow-hidden" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
      {/* Background ambient light */}
      <div className="fixed inset-0 pointer-events-none opacity-20">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-to-b from-cyan-600/20 via-blue-900/10 to-transparent rounded-full blur-[140px]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Header HUD */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-950/20 text-[10px] font-mono uppercase tracking-[0.25em] text-cyan-400 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            DIRECT MISSION UPLINK · LUCKNOW COMMS
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white mb-4">
            COMMUNICATIONS <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500">& VENUE</span>
          </h1>
          <p className="text-white/50 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
            Need guidance regarding the Lucknow hackathon format, challenge guidelines, team formations, or partnership opportunities? Establish an uplink below.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* Telemetry & Coordinator Details Card */}
          <div className="p-8 rounded-2xl border border-white/10 bg-black/60 backdrop-blur-md space-y-6">
            <div className="border-b border-white/10 pb-4">
              <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400">
                LOCAL CHAPTER COORDINATES
              </span>
              <h2 className="text-2xl font-bold text-white mt-1">
                Lucknow Station, India
              </h2>
            </div>

            <div className="space-y-4 text-xs font-mono">
              <div className="p-3 rounded-lg border border-cyan-500/20 bg-cyan-950/20">
                <span className="text-white/40 block text-[10px] uppercase">COORDINATES</span>
                <span className="text-cyan-300 font-bold">26.8467° N · 80.9462° E</span>
              </div>

              <div className="p-3 rounded-lg border border-white/10 bg-white/5">
                <span className="text-white/40 block text-[10px] uppercase">LOCAL LEAD / ORGANIZER</span>
                <span className="text-white font-semibold">Akshat Pande</span>
              </div>

              <div className="p-3 rounded-lg border border-white/10 bg-white/5">
                <span className="text-white/40 block text-[10px] uppercase">OFFICIAL CONTACT COMMS</span>
                <a
                  href="mailto:akshat.pande2007@gmail.com"
                  className="text-cyan-400 hover:text-cyan-300 underline underline-offset-2 break-all"
                >
                  akshat.pande2007@gmail.com
                </a>
              </div>

              <div className="p-3 rounded-lg border border-white/10 bg-white/5">
                <span className="text-white/40 block text-[10px] uppercase">EVENT FORMAT</span>
                <span className="text-white">Hybrid (In-Person Venue + Global Virtual Track)</span>
              </div>

              <div className="p-3 rounded-lg border border-white/10 bg-white/5">
                <span className="text-white/40 block text-[10px] uppercase">SPRINT TIMELINE</span>
                <span className="text-white">November 14–15, 2026 (48-Hour Continuous Hackathon)</span>
              </div>
            </div>

            <div className="pt-2">
              <a
                href="https://www.spaceappschallenge.org/2026/local-events/lucknow/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex justify-center items-center gap-2 px-6 py-3 text-xs font-bold uppercase tracking-widest text-black bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 rounded-lg shadow-[0_0_20px_rgba(0,240,255,0.3)] transition-all"
              >
                OFFICIAL NASA LUCKNOW PORTAL ↗
              </a>
            </div>
          </div>

          {/* Uplink Query Form */}
          <div className="p-8 rounded-2xl border border-cyan-500/30 bg-black/60 backdrop-blur-md">
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400">
                  TRANSMISSION CHANNEL
                </span>
                <h2 className="text-2xl font-bold text-white mt-1">
                  Send Uplink
                </h2>
              </div>
              <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-cyan-400/80 mb-1">
                  CALLSIGN / FULL NAME *
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={handleChange('name')}
                  placeholder="e.g. Elena Rostova"
                  className={`w-full bg-[#000814] border ${errors.name ? 'border-red-500' : 'border-white/15'} focus:border-cyan-400 rounded-lg p-3 text-xs text-white focus:outline-none font-mono`}
                />
                {errors.name && <span className="text-[10px] font-mono text-red-400 mt-1 block">{errors.name}</span>}
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-cyan-400/80 mb-1">
                  RETURN COMMS EMAIL *
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={handleChange('email')}
                  placeholder="e.g. user@domain.com"
                  className={`w-full bg-[#000814] border ${errors.email ? 'border-red-500' : 'border-white/15'} focus:border-cyan-400 rounded-lg p-3 text-xs text-white focus:outline-none font-mono`}
                />
                {errors.email && <span className="text-[10px] font-mono text-red-400 mt-1 block">{errors.email}</span>}
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-cyan-400/80 mb-1">
                  ROLE / AFFILIATION
                </label>
                <input
                  type="text"
                  value={form.role}
                  onChange={handleChange('role')}
                  placeholder="Student, Developer, Researcher, Designer"
                  className="w-full bg-[#000814] border border-white/15 focus:border-cyan-400 rounded-lg p-3 text-xs text-white focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-cyan-400/80 mb-1">
                  TRANSMISSION PAYLOAD / QUERY *
                </label>
                <textarea
                  rows={4}
                  value={form.message}
                  onChange={handleChange('message')}
                  placeholder="State your query, partnership request, or team question..."
                  className={`w-full bg-[#000814] border ${errors.message ? 'border-red-500' : 'border-white/15'} focus:border-cyan-400 rounded-lg p-3 text-xs text-white focus:outline-none font-mono resize-none`}
                />
                {errors.message && <span className="text-[10px] font-mono text-red-400 mt-1 block">{errors.message}</span>}
              </div>

              <button
                type="submit"
                disabled={status !== 'idle'}
                className="w-full py-3.5 px-6 rounded-lg text-xs font-mono uppercase tracking-widest font-bold transition-all duration-300 border border-cyan-400 bg-cyan-500/10 text-cyan-300 hover:bg-cyan-400 hover:text-black hover:shadow-[0_0_20px_rgba(0,240,255,0.4)] disabled:opacity-50"
              >
                {status === 'idle' && 'TRANSMIT UPLINK MESSAGE ↗'}
                {status === 'sending' && 'TRANSMITTING VIA SECURE RELAY...'}
                {status === 'sent' && '✓ TRANSMISSION LOGGED & DELIVERED'}
              </button>
            </form>
          </div>
        </div>
      </div>
      </div>
    </>
  );
}
