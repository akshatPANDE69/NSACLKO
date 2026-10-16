"use client";

import { useState } from "react";
import { ChartNoAxesCombined, Globe2, Orbit, Palette } from "lucide-react";
import ChallengeCard from "@/app/components/ChallengeCard";
import { event } from "@/lib/event";

const filters = ["All areas", "Earth", "Space", "Data", "Creative"];
const areas = [
  { id: "01", category: "Earth", title: "Earth & environment", description: "Explore climate, ecosystems and the connections that sustain life on our planet. Bring a question about the world around you and investigate it through NASA’s open data.", skills: "Biology · Climate · Research", approach: "A scientific model, an environmental tool or a story grounded in data.", Icon: Globe2 },
  { id: "02", category: "Space", title: "Space & exploration", description: "Look beyond Earth to astronomy, space missions and the challenges of exploration. Combine scientific curiosity with fresh ways to explain what we discover.", skills: "Physics · Astronomy · Modelling", approach: "A simulation, an educational experience or a research project.", Icon: Orbit },
  { id: "03", category: "Data", title: "Data & technology", description: "Find patterns, make evidence easier to understand or turn open data into something people can use. Analytical thinking and a useful question are valuable starting points.", skills: "Analysis · Business thinking · Coding", approach: "A visualisation, an app or a tool that helps people make sense of data.", Icon: ChartNoAxesCombined },
  { id: "04", category: "Creative", title: "Art & storytelling", description: "Make science accessible through design, stories and new ways of communicating. Your creative perspective can help people connect with ideas about Earth and space.", skills: "Humanities · Design · Communication", approach: "A short film, an interactive story or a visual explanation.", Icon: Palette },
];

export default function ChallengesExplorer() {
  const [selected, setSelected] = useState("All areas");
  const visible = areas.filter(area => selected === "All areas" || area.category === selected);
  return (
    <section className="challenge-explorer" aria-labelledby="explore-title">
      <div className="challenge-explorer-heading"><div><h2 id="explore-title">Find your starting point</h2><p>These are areas of interest. Choose your competition challenge from NASA&apos;s official {event.year} catalogue.</p></div><span className="challenge-result-count" role="status" aria-live="polite">{visible.length} {visible.length === 1 ? "area" : "areas"}</span></div>
      <div className="challenge-filters" role="group" aria-label="Filter areas of interest">{filters.map(filter => <button key={filter} type="button" aria-pressed={selected === filter} onClick={() => setSelected(filter)}>{filter}</button>)}</div>
      <div className="challenge-area-grid" data-single={visible.length === 1}>{visible.map(area => <ChallengeCard key={area.id} {...area} />)}</div>
    </section>
  );
}
