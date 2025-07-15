"use client";

import Head from "next/head";
import Link from "next/link";
import { Button } from "./components/components/ui/button";
import EffectsInitializer from "./components/EffectsInitializer";
import Particles from "./components/Particles";
import React from "react";

import { StarsBackground } from "@/components/animate-ui/backgrounds/stars";

export default function Home() {
  return (
    <div style={{ position: 'relative', width: '100%', minHeight: '100vh' }}>
      <Head>
        <title>My Next.js App</title>
        <meta name="description" content="Welcome to my Next.js application!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <EffectsInitializer />

      {/* Global Particles background, not in video section */}
      <div style={{ width: '100%', height: '100%', position: 'fixed', top: 0, left: 0, zIndex: 0, pointerEvents: 'none' }}>
        <Particles
          particleColors={["#ffffff", "#ffffff"]}
          particleCount={600}
          particleSpread={10}
          speed={0.1}
          particleBaseSize={90}
          moveParticlesOnHover={false}
          alphaParticles={true}
          disableRotation={false}
        />
      </div>

      <section className="hero-video-section fade-section" id="home" style={{ position: 'relative', zIndex: 1 }}>
        <div className="hero-video-background">
          <div className="hero-video-container">
            <video autoPlay muted loop playsInline>
              <source src="your-earth-video.mp4" type="video/mp4" />
            </video>
            <div
              style={{
                background: "linear-gradient(135deg, #000428 0%, #004e92 100%)",
                width: "100%",
                height: "100%",
              }}
            ></div>
          </div>
        </div>

        <div className="hero-video-overlay" style={{ pointerEvents: 'none', position: 'absolute', inset: 0, zIndex: 2 }}>
          <StarsBackground pointerEvents={false} className="absolute inset-0 w-full h-full z-0" />
        </div>

        {/* No Particles in video section */}

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
            {/* This will only fade in, not type */}
            <h1 className="hero-main-title fade-in" style={{ textAlign: 'center', width: '100%' }}>
              Building Solutions
              <br />
              for Space
            </h1>
            {/* This will trigger typing effect when it comes into view */}
            <p className="hero-description typing-content" data-typing-speed="80" style={{ textAlign: 'center', width: '100%' }}>
              Join the NASA Space Apps Challenge 2025 in Lucknow - the world&apos;s
              largest global hackathon. Use NASA&apos;s open data to develop innovative
              solutions for challenges we face on Earth and in space.
            </p>
            <div className="hero-cta-buttons stagger-item" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 24 }}>
              <Button asChild className="hero-btn primary">
                <Link href="/register">Register Now</Link>
              </Button>
              <Button asChild className="hero-btn primary">
                <Link href="#about">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="scroll-indicator fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'absolute', left: '50%', bottom: 40, transform: 'translateX(-50%)', pointerEvents: 'none' }}>
          <div className="scroll-arrow"></div>
          <div className="scroll-text">Scroll Down</div>
        </div>

        {/* Smooth bottom gradient overlay for video section */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            height: '120px',
            zIndex: 3,
            pointerEvents: 'none',
            background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, #000 100%)',
          }}
        ></div>
      </section>

      <section id="about" className="section fade-section" style={{ position: 'relative', zIndex: 1 }}>
        <div className="section-content stagger-container">
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              alignItems: 'flex-start', // Ensures children align to the top/left
              width: '100%',
              maxWidth: '900px',
            }}
          >
            <h3 className="stagger-item" style={{ marginBottom: 0, alignSelf: 'flex-start' }}>
              Global Innovation Challenge
            </h3>
            <h2 className="main-heading stagger-item" style={{ marginBottom: 0, alignSelf: 'flex-start' }}>
              Hack The Universe
            </h2>
            <p
              className="typing-content"
              data-typing-speed="70"
              style={{
                margin: 0,
                marginBottom: 64,
                maxWidth: '700px',
                width: '100%',
                textAlign: 'left',
                boxSizing: 'content-box',
                overflowWrap: 'break-word',
                alignSelf: 'flex-start',
              }}
            >
              NASA Space Apps Challenge is an international hackathon where teams
              of technologists, scientists, designers, artists, educators,
              entrepreneurs, and students across the globe collaborate and engage
              with publicly available data to design innovative solutions for
              challenges we face on Earth and in space. Over the course of one
              weekend, participants around the world come together to work on
              challenges designed by NASA.
            </p>
            <Button asChild className="hero-btn primary stagger-item" style={{ marginTop: '10px' }}>
              <Link href="#about">Learn More</Link>
            </Button>
          </div>
        </div>
      </section>

      <section
        id="challenges"
        className="section reverse challenges-section fade-section"
        style={{ position: 'relative', zIndex: 1, background: 'transparent' }}
      >
        <div className="section-content stagger-container">
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              alignItems: 'flex-start',
              justifyContent: 'flex-start', // Ensure children start at the top
              width: '100%',
              maxWidth: '900px',
            }}
          >
            <h3 className="stagger-item" style={{ marginBottom: 0 }}>
              Innovation Categories
            </h3>
            <h2 className="main-heading stagger-item" style={{ marginBottom: 0 }}>
              Challenge Areas
            </h2>
            <p
              className="typing-content"
              data-typing-speed="75"
              style={{
                margin: 0,
                marginBottom: 64,
                maxWidth: '700px',
                width: '100%',
                textAlign: 'left',
                boxSizing: 'border-box',
                overflowWrap: 'break-word',
                alignSelf: 'stretch', // Stretch to fill available width, but only as tall as content
              }}
            >
              This year's challenges span multiple disciplines and focus areas,
              from Earth observation and climate science to space exploration and
              astrophysics. Participants can choose from challenges that range
              from beginner-friendly to expert-level, ensuring everyone can
              contribute meaningfully.
              <br />
              Each challenge provides access to relevant NASA datasets, expert
              mentorship, and the tools needed to create impactful solutions.
              Whether you&apos;re interested in developing mobile apps, creating data
              visualizations, or building hardware prototypes, there&apos;s a challenge
              for you.
            </p>
            <Button asChild className="hero-btn primary stagger-item" style={{ marginTop: '10px', alignSelf: 'flex-start' }}>
              <Link href="/timeline">Event Schedule</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}