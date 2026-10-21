"use client";

import { useMemo, useState } from "react";
import { ArrowUpRight, Search } from "lucide-react";
import { event } from "@/lib/event";

const challenges = [
  { id: "01", category: "Creative", title: "Abandoned but not Forgotten", subtitle: "Storytelling about NASA’s Discarded Equipment on the Moon and Mars", description: "Tell the stories of hardware NASA has left across the solar system—from Moon and Mars landers and rovers to instruments and probes in deep space. Explain what each machine was built to do, what it discovered, and what its current status means for space exploration.", ideas: "Build an interactive mission timeline, a searchable archive, a short animation, a 3D explainer, or a story designed for school-age space enthusiasts.", skills: "Storytelling · Space history · Design · Web development", officialSlug: "abandoned-but-not-forgotten-storytelling-about-nasas-discarded-equipment-on-the-moon-and-mars" },
  { id: "02", category: "Earth", title: "Be An Earth System Trend Detective!", description: "Use NASA Earth science data to investigate a meaningful trend in the Earth system. Identify what is changing, where it is happening, how large the change is, and why the finding matters.", ideas: "Create a data-driven story, an interactive map, a trend dashboard, or a clear visual explanation grounded in NASA observations.", skills: "Earth science · Data analysis · Visualization · Research", officialSlug: "be-an-earth-system-trend-detective" },
  { id: "03", category: "Creative", title: "Build a Junior Astronaut Mission Trainer", description: "Design an engaging learning experience that lets younger audiences explore the decisions involved in operating an outpost on the Moon or Mars. Make the trade-offs and consequences understandable through play.", ideas: "Create a mission-management game with resource choices, crew needs, hazards, objectives, and feedback that helps players learn.", skills: "Game design · Education · UX · Coding", officialSlug: "build-a-junior-astronaut-mission-trainer" },
  { id: "04", category: "Space", title: "CLPS Lunar Mission Browser", description: "Help people explore NASA Commercial Lunar Payload Services (CLPS) missions and compare the conditions that can affect a lunar landing and surface operations, including location, lighting, communications, and solar power.", ideas: "Build an interactive mission browser or map with filters, timelines, landing-site comparisons, and useful mission context.", skills: "Lunar science · Mapping · Data visualization · Web development", officialSlug: "clps-lunar-mission-browser" },
  { id: "05", category: "Space", title: "Create Health Monitoring Software for Astronauts on Space Missions", description: "Explore how software can help track astronaut health during space missions. Present relevant health indicators clearly so that a crew or mission team can spot changes and understand trends.", ideas: "Prototype a health dashboard, trend visualizer, alert concept, or mission-health interface using clearly labelled sample or approved data.", skills: "Health data · UX · Software · Visualization", officialSlug: "create-health-monitoring-software-for-astronauts-on-space-missions" },
  { id: "06", category: "Earth", title: "Dancing with the SARs", description: "Use radar observations from the NASA–ISRO Synthetic Aperture Radar (NISAR) mission to explore how Earth’s surface changes. Make radar-based observations easier for people to interpret.", ideas: "Create an interactive before-and-after view, a map-based explainer, or a visualization that communicates changes in the landscape.", skills: "Remote sensing · Earth science · Mapping · Data visualization", officialSlug: "dancing-with-the-sars" },
  { id: "07", category: "Earth", title: "Field Shift: Adapting Farms with NASA Data", description: "Connect NASA Earth observations with agricultural decisions. Consider how information about soil, weather, crops, and environmental conditions can help farmers think through crop-rotation choices.", ideas: "Build a decision-support concept, farm planning tool, data story, or prototype that connects observations with farmer priorities.", skills: "Agriculture · Climate · Data · Product design", officialSlug: "field-shift-adapting-farms-with-nasa-data" },
  { id: "08", category: "Data", title: "Flame in Freefall: AI-Powered Fire Safety Insights from Microgravity Combustion Data", description: "Explore how combustion behaves in microgravity and how those findings can inform fire safety. Use data and responsible AI-assisted analysis to help people examine patterns and communicate insights.", ideas: "Prototype a dashboard or analysis tool that visualizes combustion experiments, compares conditions, and explains findings in accessible language.", skills: "AI/ML · Data analysis · Physics · Dashboard design", officialSlug: "flame-in-freefall-ai-powered-fire-safety-insights-from-microgravity-combustion-data" },
  { id: "09", category: "Data", title: "Harmonization of MODIS and VIIRS Hot Spots", description: "Explore active-fire observations from MODIS and VIIRS and consider how to make the records easier to compare across sensors and time. Help users see patterns without losing important context.", ideas: "Create a harmonized fire-data explorer, calendar, comparison view, or visualization that communicates uncertainty and sensor differences.", skills: "Earth observation · Data engineering · Visualization · Fire science", officialSlug: "harmonization-of-modis-and-viirs-hot-spots" },
  { id: "10", category: "Earth", title: "Identify Earth Locations that Analog the Permanent Moon Base Locations and Mars", description: "Investigate places on Earth whose environments can serve as analogs for future lunar or Martian base locations. Consider what makes a location useful for testing technologies and preparing for exploration.", ideas: "Build a map or comparison tool that layers environmental conditions, terrain, and other relevant characteristics of candidate analog sites.", skills: "Geography · Planetary science · GIS · Research", officialSlug: "identify-earth-locations-that-analog-the-permanent-moon-base-locations-and-mars" },
  { id: "11", category: "Space", title: "Interplanetary Survival Guide: Martian Map", description: "Create a useful view of Mars that brings NASA datasets together to help people understand the planet and explore information relevant to navigation, research, or future missions.", ideas: "Build a layered interactive Mars map with selectable datasets, clear legends, and helpful context for different users.", skills: "Mars science · Mapping · UX · Data integration", officialSlug: "interplanetary-survival-guide-martian-map" },
  { id: "12", category: "Space", title: "Planet X and SPHEREx", description: "Explore how the SPHEREx mission observes the sky and how observations across time can help reveal objects that move against the background sky.", ideas: "Create an image explorer or visual comparison tool that lets users inspect sky observations over time and investigate candidate moving objects.", skills: "Astronomy · Image analysis · Data visualization · Web development", officialSlug: "planet-x-and-spherex" },
  { id: "13", category: "Creative", title: "Space Mission Design Game", description: "Help players understand the many constraints behind designing a space mission. Balance mission goals with budgets, instruments, power, communications, and other engineering choices.", ideas: "Build a strategy game or simulation where design decisions affect cost, capability, risk, and mission outcomes.", skills: "Game design · Systems thinking · Engineering · Coding", officialSlug: "space-mission-design-game" },
  { id: "14", category: "Creative", title: "The Earth Information Jukebox", description: "Turn Earth science information and visualizations into a new sensory experience. Explore how sound can make patterns in Earth data more accessible, memorable, or emotionally resonant.", ideas: "Create a sonification experience, interactive soundscape, or accessible multimedia story based on Earth information.", skills: "Sound design · Earth science · Creative coding · Accessibility", officialSlug: "the-earth-information-jukebox" },
];
const officialMetadata: Record<
  string,
  { difficulty: string[]; subjects: string[] }
> = {
  "Build a Junior Astronaut Mission Trainer": {
    difficulty: ["Intermediate", "Beginner/Youth"],
    subjects: [
      "Games",
      "Planets & Moons",
      "Software",
      "Space Exploration",
      "Sun",
    ],
  },

  "Create Health Monitoring Software for Astronauts on Space Missions": {
    difficulty: ["Intermediate"],
    subjects: [
      "Human Exploration",
      "Software",
      "Space Exploration",
    ],
  },

  "Field Shift: Adapting Farms with NASA Data": {
    difficulty: ["Advanced", "Intermediate"],
    subjects: [
      "Arts & Multimedia",
      "Earth Science",
      "Software",
    ],
  },

  "The Earth Information Jukebox": {
    difficulty: ["Beginner", "Intermediate", "Advanced"],
    subjects: ["Extrasolar Objects", "Planets & Moons"],
  },

  "Be An Earth System Trend Detective!": {
    difficulty: ["Beginner", "Intermediate", "Advanced"],
    subjects: ["Extrasolar Objects", "Planets & Moons"],
  },
};

const filters = ["All", "Earth", "Space", "Data", "Creative"];

export default function ChallengesExplorer() {
  const [selected, setSelected] = useState("All");
  const [query, setQuery] = useState("");
  const visible = useMemo(() => challenges.filter((challenge) => {
    const matchesCategory = selected === "All" || challenge.category === selected;
    const text = `${challenge.title} ${challenge.subtitle ?? ""} ${challenge.description} ${challenge.skills}`.toLowerCase();
    return matchesCategory && text.includes(query.trim().toLowerCase());
  }), [selected, query]);

  return (
    <section className="challenge-explorer" id="challenge-catalog" aria-labelledby="explore-title">
      <div className="challenge-explorer-heading">
        <div>
          <p className="challenge-page-eyebrow">Official 2026 catalogue · quick guides</p>
          <h2 id="explore-title">Explore the challenges</h2>
          <p>Browse all 14 challenge summaries, filter by area, and open any card for project directions. Use the official brief for the complete requirements and judging details.</p>
        </div>
        <span className="challenge-result-count" role="status" aria-live="polite">{visible.length} of {challenges.length}</span>
      </div>
      <label className="challenge-search"><Search size={17} aria-hidden="true" /><span className="sr-only">Search challenges</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search challenges, topics, or skills…" /></label>
      <div className="challenge-filters" role="group" aria-label="Filter challenges by area">
        {filters.map((filter) => <button key={filter} type="button" aria-pressed={selected === filter} onClick={() => setSelected(filter)}>{filter}</button>)}
      </div>
      <div className="challenge-area-grid">
        {visible.map((challenge) => (
          <article className="challenge-area-card challenge-detail-card" key={challenge.id}>
            <div className="challenge-card-top"><span>{challenge.id} / {challenge.category}</span><span>NASA Space Apps 2026</span></div>
            <h3>{challenge.title}</h3>
            {challenge.subtitle && <p className="challenge-card-subtitle">{challenge.subtitle}</p>}
            <div className="challenge-official-metadata">
  <p>
    <strong>Difficulty:</strong>{" "}
    {officialMetadata[challenge.title]?.difficulty.join(" · ") ??
      "See official NASA brief"}
  </p>

  <p>
    <strong>Subjects:</strong>{" "}
    {officialMetadata[challenge.title]?.subjects.join(" · ") ??
      "See official NASA brief"}
  </p>
</div>
<p className="challenge-card-description">{challenge.description}</p>
            <p className="challenge-card-skills">{challenge.skills}</p>
            <details className="challenge-details">
              <summary>Ideas for your solution</summary>
              <p>{challenge.ideas}</p>
            </details>
            <a href={`https://www.spaceappschallenge.org/2026/challenges/${challenge.officialSlug}/`} target="_blank" rel="noopener noreferrer" className="challenge-card-link">Read official NASA brief <ArrowUpRight size={18} aria-hidden="true" /></a>
          </article>
        ))}
        {visible.length === 0 && <p className="challenge-empty-state">No challenges match that search. Try another keyword or choose “All”.</p>}
      </div>
      <p className="challenge-catalog-note">Challenge titles and short descriptions are provided as a quick guide. NASA’s official brief is the source of truth for full instructions, datasets, and deliverables.</p>
      <a className="challenge-official-catalog-link" href={event.challengesUrl} target="_blank" rel="noopener noreferrer">Open NASA’s complete 2026 challenge catalogue <ArrowUpRight size={16} aria-hidden="true" /></a>
    </section>
  );
}
