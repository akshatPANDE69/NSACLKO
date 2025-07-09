import "../styles/challenges.css";
import "../styles/base.css";

export default function ChallengePage() {
  return (
    <div className="challenges-container">
      <div className="challenges-content">
        {/* Hero Section */}
        <section className="hero-section">
          <h1 className="hero-title">HACKATHON CHALLENGES</h1>
          <p className="hero-subtitle">
            Embark on an extraordinary journey of innovation and creativity
            through our carefully crafted challenges
          </p>
        </section>

        {/* Challenge Categories */}
        <div className="content-grid">
          <section className="content-section">
            <h2 className="section-title">Featured Challenges</h2>
            <div className="challenge-grid">
              {/* Space Innovation Challenge */}
              <div className="challenge-card">
                <div className="card-title">Space Innovation Lab</div>
                <p className="card-text">
                  Design and prototype innovative solutions for space
                  exploration using NASA's open-source data and APIs.
                </p>
                <div className="challenge-meta">
                  <span className="difficulty">Advanced</span>
                  <span className="points">500 Points</span>
                </div>
              </div>

              {/* Data Visualization Challenge */}
              <div className="challenge-card">
                <div className="card-title">Cosmic Data Visualization</div>
                <p className="card-text">
                  Create compelling visualizations of space data to help
                  communicate complex astronomical concepts.
                </p>
                <div className="challenge-meta">
                  <span className="difficulty">Intermediate</span>
                  <span className="points">300 Points</span>
                </div>
              </div>

              {/* AI Space Applications */}
              <div className="challenge-card">
                <div className="card-title">AI Space Applications</div>
                <p className="card-text">
                  Develop AI-powered solutions for space exploration, satellite
                  imaging, or astronomical data analysis.
                </p>
                <div className="challenge-meta">
                  <span className="difficulty">Expert</span>
                  <span className="points">600 Points</span>
                </div>
              </div>
            </div>
          </section>

          {/* Game Challenges Section */}
          <section className="content-section">
            <h2 className="section-title">Interactive Games</h2>
            <div className="games-grid">
              {/* Space Survival Game */}
              <div className="game-card">
                <div className="card-title">Space Survival Simulator</div>
                <p className="card-text">
                  Create an engaging game that simulates survival challenges in
                  space environments.
                </p>
                <div className="game-meta">
                  <span className="team-size">2-4 Players</span>
                  <span className="duration">48 Hours</span>
                </div>
              </div>

              {/* Mars Mission */}
              <div className="game-card">
                <div className="card-title">Mars Mission Control</div>
                <p className="card-text">
                  Design a strategic game for managing resources and operations
                  on a Mars colony.
                </p>
                <div className="game-meta">
                  <span className="team-size">3-5 Players</span>
                  <span className="duration">36 Hours</span>
                </div>
              </div>
            </div>
          </section>

          {/* Prize Section */}
          <section className="prize-section content-section">
            <h2 className="section-title">Awards & Prizes</h2>
            <div className="prizes-grid">
              <div className="prize-card">
                <div className="prize-amount">$5,000</div>
                <div className="prize-title">First Place</div>
                <p className="prize-description">
                  Plus mentorship opportunities with NASA scientists
                </p>
              </div>
              <div className="prize-card">
                <div className="prize-amount">$3,000</div>
                <div className="prize-title">Second Place</div>
                <p className="prize-description">
                  Including tech hardware packages
                </p>
              </div>
              <div className="prize-card">
                <div className="prize-amount">$1,500</div>
                <div className="prize-title">Third Place</div>
                <p className="prize-description">
                  Plus cloud computing credits
                </p>
              </div>
            </div>
          </section>

          {/* Call to Action */}
          <section className="cta-section">
            <h2 className="cta-title">Ready to Take on the Challenge?</h2>
            <p className="cta-text">
              Join hundreds of innovators and space enthusiasts in this unique
              opportunity to shape the future of space exploration.
            </p>
            <div className="cta-buttons">
              <button className="cta-button primary">Register Now</button>
              <button className="cta-button secondary">Learn More</button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
