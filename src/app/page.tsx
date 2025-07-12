"use client";

import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./components/components/ui/button";
import EffectsInitializer from "./components/EffectsInitializer";
import React, { useState } from "react";

import "./styles/base.css";
import "./styles/index.css";

export default function Home() {

  return (
    <div>
      <Head>
        <title>My Next.js App</title>
        <meta name="description" content="Welcome to my Next.js application!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <EffectsInitializer />

      <section className="hero-video-section fade-section" id="home">
        <div className="hero-video-background">
          <div className="hero-video-container" style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden" }}>
            <video
              autoPlay
              muted
              loop
              playsInline
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                zIndex: 0,
              }}
            >
              <source src="your-earth-video.mp4" type="video/mp4" />
            </video>

            {/* Blue base gradient overlay */}
            <div
              style={{
                background: "linear-gradient(to bottom, #000428 0%, #004e92 100%)",
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                zIndex: 1,
                opacity: 0.4, // Adjust for desired darkness
              }}
            ></div>

            {/* Black bottom fade gradient */}
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                width: "100%",
                height: "120px",
                background: "linear-gradient(to bottom, rgba(0,0,0,0) 0%, #000 100%)",
                zIndex: 2,
              }}
            ></div>
          </div>


        </div>

        <div className="hero-video-overlay"></div>

        {/* Particles will be triggered when this container comes into view */}
        <div className="particles" id="particles"></div>

        <div className="floating-elements">
          <div className="floating-dot"></div>
          <div className="floating-dot"></div>
          <div className="floating-dot"></div>
          <div className="floating-dot"></div>
          <div className="floating-dot"></div>
        </div>

        <div className="hero-content-wrapper stagger-container">
          <div className="hero-subtitle stagger-item">
            Global Innovation Challenge
          </div>
          {/* This will only fade in, not type */}
          <h1 className="hero-main-title fade-in">
            Building Solutions
            <br />
            for Space
          </h1>
          {/* This will trigger typing effect when it comes into view */}
          <p className="hero-description typing-content" data-typing-speed="80">
            Join the NASA Space Apps Challenge 2025 in Lucknow - the world's
            largest global hackathon. Use NASA's open data to develop innovative
            solutions for challenges we face on Earth and in space.
          </p>
          <div className="hero-cta-buttons stagger-item">
            <Button asChild className="hero-btn primary">
              <Link href="/register">Register Now</Link>
            </Button>

            <Button asChild className="hero-btn primary">
              <Link href="#about">Learn More</Link>
            </Button>
          </div>
        </div>

        <div className="scroll-indicator fade-in">
          <div className="scroll-arrow"></div>
          <div className="scroll-text">Scroll Down</div>
        </div>
      </section>

      <section id="home" className="hero fade-section">
        <div className="hero-content fade-in">
          <h1 className="main-heading fade-in">Building Solutions for Space</h1>
          {/* Typing effect triggered on scroll */}
          <p className="typing-content" data-typing-speed="80">
            Join the NASA Space Apps Challenge 2025 in Lucknow - the world's
            largest global hackathon. Use NASA's open data to develop innovative
            solutions for challenges we face on Earth and in space. Connect with
            brilliant minds, create groundbreaking technologies, and contribute
            to humanity's greatest endeavors.
          </p>
          <Button asChild className="hero-btn primary fade-in">
            <Link href="#about">Learn More</Link>
          </Button>
        </div>
        <div className="hero-image fade-in"></div>
      </section>

      <section id="about" className="section fade-section">
        <div className="section-content stagger-container">
          <h3 className="stagger-item">Global Innovation Challenge</h3>
          <h2 className="main-heading stagger-item">Hack The Universe</h2>
          {/* Typing effect triggered when section comes into view */}
          <p className="typing-content" data-typing-speed="70">
            NASA Space Apps Challenge is an international hackathon where teams
            of technologists, scientists, designers, artists, educators,
            entrepreneurs, and students across the globe collaborate and engage
            with publicly available data to design innovative solutions for
            challenges we face on Earth and in space.
            <br />
            Over the course of one weekend, participants around the world come
            together to work on challenges designed by NASA. The event is free
            to attend, and all backgrounds and skill levels are encouraged to
            participate.
          </p>
          <Button asChild className="hero-btn primary stagger-item">
            <Link href="#about">Learn More</Link>
          </Button>
        </div>
        <div className="section-image satellite-section fade-in"></div>
      </section>

      <section
        id="challenges"
        className="section reverse challenges-section fade-section"
      >
        <div className="section-content stagger-container">
          <h3 className="stagger-item">Innovation Categories</h3>
          <h2 className="main-heading stagger-item">Challenge Areas</h2>
          {/* Another typing effect triggered on scroll */}
          <p className="typing-content" data-typing-speed="75">
            This year's challenges span multiple disciplines and focus areas,
            from Earth observation and climate science to space exploration and
            astrophysics. Participants can choose from challenges that range
            from beginner-friendly to expert-level, ensuring everyone can
            contribute meaningfully.
            <br />
            Each challenge provides access to relevant NASA datasets, expert
            mentorship, and the tools needed to create impactful solutions.
            Whether you're interested in developing mobile apps, creating data
            visualizations, or building hardware prototypes, there's a challenge
            for you.
          </p>
          <Button asChild className="hero-btn primary stagger-item">
            <Link href="/timeline">Event Schedule</Link>
          </Button>
        </div>
        <div className="section-image rocket-section fade-in"></div>
      </section>
    </div>
  );
}
