import type { Metadata } from "next";
import TeamPageClient from "./TeamPageClient";
import { event } from "@/lib/event";

export const metadata: Metadata = {
  title: `Our Team | ${event.name} Lucknow`,
  description: `Meet the organizers, mentors, and technologists leading the NASA Space Apps Challenge ${event.year} in Lucknow at ${event.venue}.`,
  openGraph: {
    title: `Our Team | NASA Space Apps Challenge Lucknow`,
    description: `Meet the core team and mentors driving innovation for NASA Space Apps Challenge Lucknow.`,
  },
};

export default function TeamPage() {
  return <TeamPageClient />;
}
