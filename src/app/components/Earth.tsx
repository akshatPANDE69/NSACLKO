"use client";

import Image from "next/image";
import { Pause, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { createEarthScene } from "@/lib/earth-scene";

export default function Earth() {
  const host = useRef<HTMLDivElement>(null);
  const scene = useRef<ReturnType<typeof createEarthScene> | null>(null);
  const paused = useRef(false);
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const container = host.current;
    if (!container) return;
    let cancelled = false;
    let visible = false;
    let failed = false;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      setReduced(preference.matches);
      const running = visible && !document.hidden && !preference.matches && !paused.current && !failed;
      scene.current?.setAnimating(running);
      setPlaying(running && !!scene.current);
    };
    const load = async () => {
      if (scene.current || preference.matches || failed) return;
      try {
        const { createEarthScene } = await import("@/lib/earth-scene");
        if (cancelled || scene.current || preference.matches) return;
        scene.current = createEarthScene(container, () => { if (!cancelled) setReady(true); }, () => {
          failed = true;
          if (!cancelled) { setReady(false); setPlaying(false); }
        });
        update();
      } catch {
        failed = true;
        if (!cancelled) { setReady(false); setPlaying(false); }
      }
    };
    const motionChange = () => { update(); if (visible) void load(); };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      update();
      if (visible) void load();
    });
    observer.observe(container);
    preference.addEventListener("change", motionChange);
    document.addEventListener("visibilitychange", update);
    update();
    return () => {
      cancelled = true;
      observer.disconnect();
      preference.removeEventListener("change", motionChange);
      document.removeEventListener("visibilitychange", update);
      scene.current?.destroy();
      scene.current = null;
    };
  }, []);

  return (
    <figure className="earth-figure">
      <div className="earth-orbit" aria-hidden="true" />
      <div className="earth-visual" data-ready={ready}>
        <Image src="/images/earth-fallback.jpg" alt="Earth seen from space, with blue oceans and swirling white clouds" fill priority sizes="(max-width: 700px) 90vw, 50vw" className="earth-fallback" />
        <div ref={host} className="earth-canvas" aria-hidden="true" />
      </div>
      <figcaption className="earth-caption"><span>01 / Our home planet</span><span>A world worth building for.</span></figcaption>
      {ready && !reduced && <button className="earth-toggle" type="button" aria-label={playing ? "Pause Earth rotation" : "Play Earth rotation"} onClick={() => {
        paused.current = !paused.current;
        scene.current?.setAnimating(!paused.current);
        setPlaying(!paused.current);
      }}>{playing ? <Pause size={14} aria-hidden="true" /> : <Play size={14} aria-hidden="true" />}<span>{playing ? "Pause" : "Play"} rotation</span></button>}
    </figure>
  );
}
