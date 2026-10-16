"use client";

import { Pause, Play } from "lucide-react";
import { useEffect, useRef, useState, type RefObject } from "react";

/** Playback controls for the original Earth video. The existing 3D scene is unchanged. */
export default function HeroPlaybackControl({ videoRef }: { videoRef: RefObject<HTMLVideoElement | null> }) {
  const manuallyPaused = useRef(false);
  const [playing, setPlaying] = useState(false);
  const [available, setAvailable] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let visible = true;
    const update = () => {
      if (preference.matches || document.hidden || !visible || manuallyPaused.current) video.pause();
      else void video.play().catch(() => { /* The original Earth frame remains visible. */ });
    };
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onError = () => { video.pause(); setAvailable(false); };
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; update(); });
    observer.observe(video);
    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);
    video.addEventListener("error", onError);
    preference.addEventListener("change", update);
    document.addEventListener("visibilitychange", update);
    update();
    return () => {
      observer.disconnect();
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
      video.removeEventListener("error", onError);
      preference.removeEventListener("change", update);
      document.removeEventListener("visibilitychange", update);
      video.pause();
    };
  }, [videoRef]);

  if (!available) return null;
  return <button type="button" className="hero-playback-control" aria-label={playing ? "Pause Earth animation" : "Play Earth animation"} onClick={() => {
    const video = videoRef.current;
    if (!video) return;
    manuallyPaused.current = !video.paused;
    if (manuallyPaused.current) video.pause();
    else void video.play().catch(() => {});
  }}>{playing ? <Pause size={13} aria-hidden="true" /> : <Play size={13} aria-hidden="true" />}<span>{playing ? "Pause" : "Play"} Earth</span></button>;
}
