"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";

export default function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const manuallyPaused = useRef(false);
  const [playing, setPlaying] = useState(false);
  const [available, setAvailable] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePlayback = () => {
      if (preference.matches || document.hidden || manuallyPaused.current) video.pause();
      else void video.play().catch(() => { /* Retain the static background if autoplay is unavailable. */ });
    };
    updatePlayback();
    preference.addEventListener("change", updatePlayback);
    document.addEventListener("visibilitychange", updatePlayback);
    return () => {
      preference.removeEventListener("change", updatePlayback);
      document.removeEventListener("visibilitychange", updatePlayback);
      video.pause();
    };
  }, []);

  const togglePlayback = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      manuallyPaused.current = false;
      void video.play().catch(() => {});
    } else {
      manuallyPaused.current = true;
      video.pause();
    }
  };

  return (
    <>
      <video ref={videoRef} className="hero-video" muted loop playsInline preload="metadata" aria-hidden="true" onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)}>
        <source src="/your-earth-video.mp4" type="video/mp4" onError={() => { setAvailable(false); setPlaying(false); }} />
      </video>
      {available && <button type="button" className="video-toggle" onClick={togglePlayback} aria-label={playing ? "Pause background video" : "Play background video"}>
        {playing ? <Pause size={16} aria-hidden="true" /> : <Play size={16} aria-hidden="true" />}
      </button>}
    </>
  );
}
