import { event } from "@/lib/event";

import EffectsInitializer from "@/app/components/EffectsInitializer";

import "@/app/styles/base.css";
import "@/app/styles/timeline.css";

export default function Timeline() {
  return (
    <div>
      <EffectsInitializer />
      
      <section id="timeline" className="timeline-section">
        <div className="timeline-container">
          <div className="timeline-header fade-in">
            <h1 className="main-heading timeline-heading-center">Event Timeline</h1>
          </div>
          <div className="timeline-grid">
            <div className="timeline-item fade-in">
              <div className="timeline-date">26 August 2026</div>
              <div className="timeline-content">
                <div className="timeline-title">Registration Opens</div>
                <div className="timeline-desc typing-content">
                  Team registration begins. Start forming your teams and
                  preparing for the ultimate space hackathon experience.
                </div>
              </div>
            </div>
            <div className="timeline-item fade-in">
              <div className="timeline-date">17 September 2026</div>
              <div className="timeline-content">
                <div className="timeline-title">Challenges Announced</div>
                <div className="timeline-desc typing-content">
                  Challenge summaries and team formation open. Full challenge
                  briefs and resources are scheduled for 28 October 2026.
                </div>
              </div>
            </div>
            <div className="timeline-item fade-in">
              <div className="timeline-date">14 and 15 November 2026</div>
              <div className="timeline-content">
                <div className="timeline-title">Hackathon Weekend</div>
                <div className="timeline-desc typing-content">
                  Collaborate, explore and create at {event.venue}, {event.address}.
                  Submit your project on the official team page by 11:59 PM local time on 15 November.
                </div>
              </div>
            </div>
            <div className="timeline-item fade-in">
              <div className="timeline-date">After the hackathon</div>
              <div className="timeline-content">
                <div className="timeline-title">Global Judging</div>
                <div className="timeline-desc typing-content">
                  Eligible projects selected locally may advance to global judging
                  for consideration for NASA Space Apps Global Awards.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>{" "}
    </div>
  );
}
