import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gaming Subevent | NASA Space Apps Challenge Lucknow",
  description:
    "NASA Space Apps Challenge Lucknow Esports Subevent. Explore BGMI, COD, FIFA, Tekken, Mortal Kombat and Free Fire. Registrations coming soon.",
};

export default function GamingPage() {
  return (
    <iframe
      src="/gaming/index.html"
      title="NASA Space Apps Lucknow — Gaming Subevent"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        border: "none",
        zIndex: 9999,
      }}
      allowFullScreen
    />
  );
}
