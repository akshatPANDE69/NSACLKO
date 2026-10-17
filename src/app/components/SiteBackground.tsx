"use client";

import { usePathname } from "next/navigation";
import ChallengeBackground from "@/app/components/ChallengeBackground";
import "@/app/styles/site-background.css";

// These pages already render the original stars alongside their existing scenes.
const pagesWithStars = new Set(["/", "/team", "/challenges"]);

export default function SiteBackground() {
  const pathname = usePathname() ?? "/";
  if (pagesWithStars.has(pathname)) return null;

  return (
    <div className="site-star-background" aria-hidden="true">
      <ChallengeBackground />
    </div>
  );
}
