"use client";

import { usePathname } from "next/navigation";
import ChallengeBackground from "@/app/components/ChallengeBackground";
import "@/app/styles/site-background.css";

// These pages provide their own scenes; Esports covers the shell with its iframe.
const pagesWithOwnScene = new Set(["/", "/team", "/challenges", "/gaming"]);

export default function SiteBackground() {
  const pathname = usePathname() ?? "/";
  if (pagesWithOwnScene.has(pathname)) return null;

  return (
    <div className="site-star-background" aria-hidden="true">
      <ChallengeBackground />
    </div>
  );
}
