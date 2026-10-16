"use client";

import { useEffect } from "react";

// Keep the existing reveal effect without replacing React-owned text or leaking timers.
export default function EffectsInitializer() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const animations: Animation[] = [];
    let observer: IntersectionObserver | null = null;
    if (!reduced && "IntersectionObserver" in window) {
      observer = new IntersectionObserver((entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            animations.push(entry.target.animate(
              [{ opacity: 0, transform: "translateY(18px)" }, { opacity: 1, transform: "translateY(0)" }],
              { duration: 600, easing: "ease-out" },
            ));
            observer?.unobserve(entry.target);
          }
        }, { threshold: 0.05 });
    }
    document.querySelectorAll(".typing-content, .stagger-item, .timeline-item").forEach((element) => observer?.observe(element));
    const updateNavbar = () => document.getElementById("navbar")?.classList.toggle("scrolled", window.scrollY > 100);
    updateNavbar();
    window.addEventListener("scroll", updateNavbar, { passive: true });
    return () => {
      observer?.disconnect();
      animations.forEach((animation) => animation.cancel());
      window.removeEventListener("scroll", updateNavbar);
    };
  }, []);
  return null;
}
