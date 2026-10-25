"use client";

import { event } from "@/lib/event";
import Link from "next/link";
import { Button } from "@/app/components/components/ui/button";
import EffectsInitializer from "@/app/components/EffectsInitializer";
import Particles from "@/app/components/Particles";
import React from "react";
import { ArrowUpRight, ChartNoAxesCombined, Globe2, Orbit, Palette } from "lucide-react";

import { StarsBackground } from "@/components/animate-ui/backgrounds/stars";
import ScrollPageLoaderTransition from "@/components/ScrollPageLoaderTransition";

const experience = [
  { title: "Explore the data", text: "Investigate a real question using NASA’s open data and resources." },
  { title: "Build together", text: "Combine your strengths with people who bring different skills and perspectives." },
  { title: "Share your solution", text: "Turn your research, prototype or creative idea into a project you can present." },
];

const areas = [
  { title: "Earth & environment", text: "Climate, biology and the systems that sustain our planet.", Icon: Globe2 },
  { title: "Space & exploration", text: "Astronomy, space missions and questions beyond Earth.", Icon: Orbit },
  { title: "Data & technology", text: "Research, visualisation and tools that make open data useful.", Icon: ChartNoAxesCombined },
  { title: "Art & storytelling", text: "Design, communication and creative ways to share science.", Icon: Palette },
];

export default function Home() {
  const videoRef = React.useRef<HTMLVideoElement>(null);

  React.useEffect(() => {
    if (videoRef.current) {
      void videoRef.current.play().catch(() => {});
    }
  }, []);

  return (
    <div className="home-page" style={{ position: 'relative', width: '100%', minHeight: '100vh' }}>
      <EffectsInitializer />

      {/* Global Particles background, not in video section */}
      <div className="home-particles" style={{ width: '100%', height: '100%', position: 'fixed', top: 0, left: 0, zIndex: 0, pointerEvents: 'none' }}>
        <Particles
          particleColors={["#ffffff", "#ffffff", "#f0f8ff"]}
          particleCount={350}
          particleSpread={10}
          speed={0.04}
          particleBaseSize={55}
          moveParticlesOnHover={false}
          alphaParticles={true}
          disableRotation={false}
        />
      </div>

      <section className="hero-video-section fade-section" id="home" style={{ position: 'relative', zIndex: 1 }}>
        <div className="hero-video-background">
          <div className="hero-video-container">
            <video ref={videoRef} autoPlay muted loop playsInline preload="metadata" poster="/earth-poster.jpg" aria-hidden="true">
              <source src="/your-earth-video.mp4" type="video/mp4" />
            </video>
            <div
              style={{
                background: "linear-gradient(135deg, rgba(0,4,40,0.85) 0%, rgba(0,78,146,0.7) 100%)",
                width: "100%",
                height: "100%",
              }}
            ></div>
          </div>
        </div>

        <div className="hero-video-overlay" style={{ pointerEvents: 'none', position: 'absolute', inset: 0, zIndex: 2 }}>
          <StarsBackground pointerEvents={false} className="absolute inset-0 w-full h-full z-0" />
        </div>

        <div className="floating-elements">
          <div className="floating-dot"></div>
          <div className="floating-dot"></div>
          <div className="floating-dot"></div>
          <div className="floating-dot"></div>
          <div className="floating-dot"></div>
        </div>

        <div className="hero-content-wrapper stagger-container">
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
            <div className="hero-subtitle stagger-item" style={{ textAlign: 'center', width: '100%' }}>
              Global Innovation Challenge
            </div>
            <h1 className="hero-main-title fade-in" style={{ textAlign: 'center', width: '100%' }}>
              Building Solutions
              <br />
              for Space
            </h1>
            <p className="hero-description typing-content" data-typing-speed="80" style={{ textAlign: 'center', width: '100%' }}>
              Join the NASA Space Apps Challenge {event.year} in Lucknow, the world&apos;s
              largest global hackathon. Use NASA&apos;s open data to develop innovative
              solutions for challenges we face on Earth and in space.
            </p>
            <p className="event-summary">{event.dates} · {event.venue}, Lucknow</p>
            <div className="hero-cta-buttons stagger-item" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 24 }}>
              <Button asChild className="hero-btn primary">
                <Link href={event.registrationUrl}>Register Now</Link>
              </Button>
              <Button asChild className="hero-btn primary">
                <Link href="#about">Learn More</Link>
              </Button>
            </div>
            <div className="hero-community">
              <a href={event.whatsappUrl} target="_blank" rel="noopener noreferrer">Join our WhatsApp community ↗</a>
              <p>Event updates, questions and finding your team.</p>
            </div>
          </div>
        </div>

        <div className="scroll-indicator fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'absolute', left: '50%', bottom: 40, transform: 'translateX(-50%)', pointerEvents: 'none' }}>
          <div className="scroll-arrow"></div>
          <div className="scroll-text">Scroll Down</div>
        </div>
      </section>

      {/* ── Scroll-driven Earth Transition: Hero → About ── */}
      <ScrollPageLoaderTransition />

      <section id="about" className="section home-info-section fade-section" aria-labelledby="home-about-title" style={{ position: 'relative', zIndex: 1 }}>
        <div className="home-info-grid">
          <div className="home-info-copy stagger-container">
            <p className="home-section-label stagger-item">Global Innovation Challenge</p>
            <h2 id="home-about-title" className="main-heading stagger-item">Hack The Universe</h2>
            <p className="typing-content">NASA Space Apps Challenge brings curious minds together to work on questions facing Earth and space, using publicly available NASA data. Over one weekend, you choose a challenge, build a team and turn an idea into a project.</p>
            <p className="typing-content">Science, commerce, humanities or biology: your perspective belongs here. School and college students are welcome, with no previous hackathon or coding experience required.</p>
            <div className="home-section-actions">
              <Button asChild className="hero-btn primary"><Link href="/about">Learn More</Link></Button>
            </div>
          </div>
          <aside className="home-section-aside" aria-labelledby="experience-title">
            <p id="experience-title" className="home-aside-label">What you will do</p>
            <ol className="home-experience-list">
              {experience.map(({ title, text }, index) => (
                <li key={title}>
                  <span className="home-step-number" aria-hidden="true">0{index + 1}</span>
                  <div><h3>{title}</h3><p>{text}</p></div>
                </li>
              ))}
            </ol>
          </aside>
        </div>
      </section>

      {/* ── Scroll-driven Earth Transition: About → Challenges ── */}
      <ScrollPageLoaderTransition />

      <section id="challenges" className="section home-info-section home-challenge-section fade-section" aria-labelledby="home-challenges-title" style={{ position: 'relative', zIndex: 1 }}>
        <div className="home-info-grid">
          <div className="home-info-copy stagger-container">
            <p className="home-section-label stagger-item">Innovation Categories</p>
            <h2 id="home-challenges-title" className="main-heading stagger-item">Challenge Areas</h2>
            <p className="typing-content">Explore our planet, investigate the universe or find a new way to make NASA&apos;s data useful. Different challenges call for different skills.</p>
            <p className="typing-content">Your solution could be an app, a scientific model, a data visualisation or a creative story. Start with an area that interests you, then choose a challenge from the official {event.year} briefs.</p>
            <div className="home-section-actions">
              <Button asChild className="hero-btn primary"><Link href={event.challengesUrl}>Explore Challenges</Link></Button>
              <Link href="/timeline" className="home-schedule-link">Event Schedule <ArrowUpRight size={17} aria-hidden="true" /></Link>
            </div>
          </div>
          <aside className="home-section-aside" aria-labelledby="areas-title">
            <p id="areas-title" className="home-aside-label">Find your starting point</p>
            <ul className="home-area-list">
              {areas.map(({ title, text, Icon }) => (
                <li key={title}><Icon size={24} strokeWidth={1.25} aria-hidden="true" /><div><h3>{title}</h3><p>{text}</p></div></li>
              ))}
            </ul>
            <p className="home-areas-note">Areas of interest, with official challenges linked above.</p>
          </aside>
        </div>
      </section>
    </div>
  );
}
