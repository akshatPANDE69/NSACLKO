import Head from "next/head";
import Image from "next/image";

import EffectsInitializer from "../components/EffectsInitializer";

import "../styles/base.css";
import "../styles/timeline.css";

export default function Timeline() {
  return (
    <div>
      <Head>
        <title>My Next.js App</title>
        <meta name="description" content="Welcome to my Next.js application!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <EffectsInitializer />
      
      <section id="timeline" className="timeline-section">
        <div className="timeline-container">
          <div className="timeline-header fade-in">
            <h2 className="main-heading">Event Timeline</h2>
          </div>
          <div className="timeline-grid">
            <div className="timeline-item fade-in">
              <div className="timeline-date">July 15, 2025</div>
              <div className="timeline-content">
                <div className="timeline-title">Registration Opens</div>
                <div className="timeline-desc typing-content">
                  Team registration begins. Start forming your teams and
                  preparing for the ultimate space hackathon experience.
                </div>
              </div>
            </div>
            <div className="timeline-item fade-in">
              <div className="timeline-date">September 1, 2025</div>
              <div className="timeline-content">
                <div className="timeline-title">Challenges Announced</div>
                <div className="timeline-desc typing-content">
                  Official NASA challenges are released globally. Review the
                  problems and start brainstorming solutions.
                </div>
              </div>
            </div>
            <div className="timeline-item fade-in">
              <div className="timeline-date">October 4-6, 2025</div>
              <div className="timeline-content">
                <div className="timeline-title">Hackathon Weekend</div>
                <div className="timeline-desc typing-content">
                  48 hours of intensive collaboration, coding, and innovation at
                  the Lucknow venue with mentors and experts.
                </div>
              </div>
            </div>
            <div className="timeline-item fade-in">
              <div className="timeline-date">November 2025</div>
              <div className="timeline-content">
                <div className="timeline-title">Global Judging</div>
                <div className="timeline-desc typing-content">
                  Best solutions from Lucknow compete globally for the chance to
                  present at NASA Headquarters in Washington, DC.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>{" "}
    </div>
  );
}
