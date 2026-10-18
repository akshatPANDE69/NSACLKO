import type { Metadata } from "next";
import FlappyBirdGame from "@/app/components/FlappyBirdGame";
import "@/app/styles/game.css";

export const metadata: Metadata = {
  title: "Flappy Bird | NASA Space Apps Lucknow 2026",
  description: "Play Flappy Bird, sign in with Google and climb the NASA Space Apps Lucknow leaderboard. First place wins a surprise prize. Everyone is welcome.",
};

export default function GamePage() {
  return <FlappyBirdGame />;
}
