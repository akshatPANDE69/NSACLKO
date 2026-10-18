"use client";

import { Component, useEffect, useState, type ReactNode } from "react";
import Particles from "@/app/components/Particles";

const colors = ["#ffffff", "#ffffff", "#f0f8ff"];

class BackgroundFallback extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? null : this.props.children; }
}

/** Reuse the original site scene without changing its geometry or shaders. */
export default function ChallengeBackground() {
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setEnabled(!preference.matches);
    update();
    preference.addEventListener("change", update);
    return () => preference.removeEventListener("change", update);
  }, []);
  return <div className="challenge-space-background" aria-hidden="true">{enabled && <BackgroundFallback><Particles particleColors={colors} particleCount={350} particleSpread={10} speed={0.04} particleBaseSize={55} moveParticlesOnHover={false} alphaParticles disableRotation={false} /></BackgroundFallback>}</div>;
}
