"use client";

import { useState } from "react";
import ChallengeCard from "@/app/components/ChallengeCard";

type Challenge = {
  id: string;
  category: string;
  title: string;
  description: string;
  skills: string;
  approach: string;
  image: string;
};

const filters = ["All challenges", "Space", "Earth", "Data", "Creative"] as const;

const challenges: Challenge[] = [
  {
    id: "01",
    category: "Space",
    title: "A World Away: Hunting for Exoplanets with AI",
    description:
      "Train machine learning models on telescope transit spectroscopy and Kepler/JWST telemetry to detect habitable exoplanets and atmospheric biosignatures.",
    skills: "AI / ML · Astrophysics · Data Science",
    approach: "A neural classifier or interactive exoplanetary discovery model.",
    image: "/challenges/exoplanet.jpg",
  },
  {
    id: "02",
    category: "Earth",
    title: "BloomWatch: Earth Observation for Global Phenology",
    description:
      "Analyze Earth observation satellite imagery from Landsat and Sentinel to monitor seasonal vegetation cycles, agricultural shifts, and ecological health.",
    skills: "Earth Observation · GIS · Python",
    approach: "A climate tracking dashboard or local farmer phenology forecasting tool.",
    image: "/challenges/bloomwatch.jpg",
  },
  {
    id: "03",
    category: "Space",
    title: "Meteor Madness: Tracking Near-Earth Objects",
    description:
      "Compute orbital trajectories and analyze impact probabilities for newly cataloged asteroids and fireball events using NASA CNEOS data.",
    skills: "Orbital Mechanics · Three.js · Physics",
    approach: "A 3D near-Earth asteroid trajectory simulation or meteor tracker.",
    image: "/challenges/meteor.jpg",
  },
  {
    id: "04",
    category: "Earth",
    title: "From EarthData to Action: Predicting Cleaner Skies",
    description:
      "Use NASA open satellite telemetry to track air quality, aerosol optical depth, and wildfire smoke drift to protect vulnerable communities.",
    skills: "Open Science · Data Visualization · GIS",
    approach: "An actionable air quality early warning system or public health dashboard.",
    image: "/challenges/earthdata.jpg",
  },
  {
    id: "05",
    category: "Creative",
    title: "Deep Dive: Immersive Ocean to Sky Data Stories",
    description:
      "Translate complex oceanographic, atmospheric, and celestial measurements into compelling interactive narratives and artistic visualizations.",
    skills: "Creative Tech · UI/UX · WebGL",
    approach: "An immersive interactive story, 3D visual journey, or sonic data experience.",
    image: "/challenges/deepdive.jpg",
  },
  {
    id: "06",
    category: "Data",
    title: "Build a Space Biology Knowledge Engine",
    description:
      "Organize decades of biological experiment telemetry from the International Space Station into an intuitive search and query knowledge graph.",
    skills: "Knowledge Graphs · NLP · Bioinformatics",
    approach: "An AI-powered search tool or interactive microgravity biological database.",
    image: "/challenges/spacebiology.jpg",
  },
  {
    id: "07",
    category: "Space",
    title: "Commercializing Low Earth Orbit (LEO)",
    description:
      "Design sustainable business architectures, logistics models, or payload deployment systems for private and scientific operations in LEO.",
    skills: "Aerospace Strategy · Systems Engineering · Economics",
    approach: "A station logistics simulator, orbital supply chain model, or LEO marketplace.",
    image: "/challenges/leo.jpg",
  },
  {
    id: "08",
    category: "Creative",
    title: "Your Home in Space: Habitat Layout Creator",
    description:
      "Architect functional, psychologically supportive, and radiation‑shielded living quarters for astronauts on long‑duration Lunar and Martian expeditions.",
    skills: "Architecture · 3D Design · Human Factors",
    approach: "A modular 3D habitat designer or architectural space planning tool.",
    image: "/challenges/habitat.jpg",
  },
];

export default function ChallengesExplorer() {
  const [selected, setSelected] = useState<(typeof filters)[number]>("All challenges");

  const visible = challenges.filter(
    (c) => selected === "All challenges" || c.category === selected
  );

  const handleFilterClick = (filter: (typeof filters)[number]) => {
    setSelected(filter);
  };

  return (
    <section className="challenge-explorer" aria-labelledby="explore-title">
      <div className="challenge-explorer-heading">
        <div>
          <h2 id="explore-title">Official NASA Challenges</h2>
          <p>
            Explore real challenge problem statements from NASA Space Apps. Choose a problem
            that excites you and build your solution using NASA open data.
          </p>
        </div>
        <span
          className="challenge-result-count"
          role="status"
          aria-live="polite"
        >
          {visible.length} {visible.length === 1 ? "challenge" : "challenges"}
        </span>
      </div>

      <div className="challenge-filters" role="group" aria-label="Filter challenges">
        {filters.map((filter) => (
          <button
            key={filter}
            type="button"
            aria-pressed={selected === filter}
            onClick={() => handleFilterClick(filter)}
            className={selected === filter ? "active" : undefined}
          >
            {filter}
          </button>
        ))}
      </div>

      <div className="challenge-area-grid" data-single={visible.length === 1}>
        {visible.map((item) => (
          <ChallengeCard key={item.id} {...item} />
        ))}
      </div>
    </section>
  );
}
