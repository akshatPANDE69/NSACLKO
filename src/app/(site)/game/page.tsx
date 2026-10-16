import type { Metadata } from "next";
import FlappyBirdGame from "@/app/components/FlappyBirdGame";
import "@/app/styles/game.css";

export const metadata: Metadata = {
  title: "Flappy Bird | NASA Space Apps Lucknow 2026",
  description: "Play the NASA Space Apps Lucknow arcade game and beat your personal high score.",
};

export default function GamePage() {
  return <FlappyBirdGame />;
}
