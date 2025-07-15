"use client";

import React from "react";
import "../styles/base.css";
import "../styles/about.css";
import "../styles/carousel-override.css";
import CountUp from "../components/CountUp";
import { Button } from "../components/components/ui/button";
import { Card, CardContent, CardTitle } from "../components/components/ui/card";
import { TiltedCarousel } from "../components/TiltedCard";
import Link from "next/link";

export default function About() {
  return (
    <div className="about-container">
      <div className="about-content">
        <section className="hero-section">
          <h1 className="hero-title">ABOUT</h1>
          <p className="hero-subtitle">
            The world&apos;s largest global hackathon, inspiring innovation for space
            exploration and Earth challenges
          </p>
        </section>

        <div className="content-grid">
          <section className="content-section">
            <h2 className="section-title">
              What is NASA Space Apps Challenge?
            </h2>
            <p className="section-text">
              NASA&apos;s International Space Apps Challenge is an annual hackathon
              that takes place over 48 hours in cities around the world. The
              event embraces collaborative problem-solving with a goal of
              producing relevant open-source solutions to advance space
              exploration missions and improve life on Earth.
            </p>
            <p className="section-text">
              Each year, thousands of global citizens come together to work with
              NASA data in order to solve challenges we face on Earth and in
              space. Space Apps is more than a hackathon - it&apos;s a community of
              innovators, scientists, coders, storytellers, makers, builders,
              technologists, and entrepreneurs.
            </p>
          </section>

          <section className="content-section">
            <h2 className="section-title">Meet the team</h2>
            {/* Pass custom cards data to TiltedCarousel */}
            <TiltedCarousel cards={require("../components/TiltedCard").defaultCardsData} />
          </section>

          <section className="content-section">
            <h2 className="section-title">Our Mission</h2>
            <div className="mission-grid">
              {[
                {
                  title: "Inspire",
                  text: "Engage and inspire people around the world to use NASA&apos;s open data for local and global solutions",
                },
                {
                  title: "Innovate",
                  text: "Foster innovation through collaborative problem-solving and cross-disciplinary teamwork",
                },
                {
                  title: "Impact",
                  text: "Create meaningful solutions that benefit both space exploration and life on Earth",
                },
              ].map((mission, index) => (
                <Card key={index} className="mission-card">
                  <CardContent className="card-content">
                    <CardTitle className="card-title">
                      {mission.title}
                    </CardTitle>
                    <p className="card-text">{mission.text}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <section className="content-section">
            <h2 className="section-title">Why Participate?</h2>
            <p className="section-text">
              Participating in NASA Space Apps Challenge is an opportunity to
              collaborate with like-minded individuals, learn new skills, and
              contribute to solving real-world problems. Whether you&apos;re a
              developer, designer, scientist, or simply passionate about space
              and technology, Space Apps offers a platform to make a difference.
            </p>
            <p className="section-text">
              By joining Space Apps, you&apos;ll gain access to NASA&apos;s open data,
              connect with experts and mentors, and have the chance to showcase
              your solutions on a global stage.
            </p>
          </section>

          <section className="content-section">
            <h2 className="section-title">Global Impact</h2>
            <div className="stats-grid">
              {[
                { number: 400, label: "Cities Worldwide" },
                { number: 50000, label: "Global Participants" },
                { number: 15000, label: "Projects Created" },
                { number: 80, label: "Countries Participating" },
              ].map((stat, index) => (
                <div key={index} className="stat-item">
                  <div className="stat-number">
                    <CountUp
                      from={0}
                      to={stat.number}
                      separator=","
                      direction="up"
                      duration={1}
                      className="count-up-text"
                      startWhen={true}
                    />
                    +
                  </div>
                  <div className="stat-label">{stat.label}</div>
                </div>
              ))}
            </div>
          </section>

          <section className="content-section">
            <h2 className="section-title">How It Works</h2>
            <div className="process-steps">
              {[
                {
                  number: "01",
                  title: "Choose Your Challenge",
                  text: "Select from various challenges spanning Earth science, space exploration, and technology innovation",
                },
                {
                  number: "02",
                  title: "Form Your Team",
                  text: "Collaborate with diverse minds from different backgrounds, skills, and perspectives",
                },
                {
                  number: "03",
                  title: "Build & Create",
                  text: "Develop innovative solutions using NASA&apos;s open data, APIs, and cutting-edge technologies",
                },
                {
                  number: "04",
                  title: "Present & Impact",
                  text: "Share your solution with the community and compete for global recognition",
                },
              ].map((step, index) => (
                <div key={index} className="step">
                  <div className="step-number">{step.number}</div>
                  <div className="step-content">
                    <h3 className="step-title">{step.title}</h3>
                    <p className="step-text">{step.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="cta-section">
            <h2 className="cta-title">Ready to Make an Impact?</h2>
            <p className="cta-text">
              Join thousands of innovators worldwide in creating solutions that
              matter. Whether you&apos;re a seasoned developer, a creative designer,
              or simply passionate about space and technology, there&apos;s a place
              for you at NASA Space Apps.
            </p>
            <div className="cta-buttons">
              {[
                { href: "#about", text: "Register Now" },
                { href: "#about", text: "View Challenges" },
              ].map((button, index) => (
                <Button key={index} asChild className="hero-btn primary">
                  <Link href={button.href}>{button.text}</Link>
                </Button>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
