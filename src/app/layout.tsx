import type { Metadata } from "next";
import localFont from "next/font/local";
import ScrollProgressBar from "./components/ScrollProgressBar";
import NavBar from "./components/navbar";
import Footer from "./components/footer";
import { event } from "@/lib/event";

import "./styles/base.css";
import "./styles/index.css";

const spaceGrotesk = localFont({
  src: [{ path: "./fonts/SpaceGrotesk-Regular.ttf", weight: "400" }, { path: "./fonts/SpaceGrotesk-Bold.ttf", weight: "700" }],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://nsaclko.vercel.app"),
  title: { default: "NASA Space Apps Challenge 2026 | Lucknow", template: "%s | NASA Space Apps Lucknow 2026" },
  description: `Join NASA Space Apps Challenge in Lucknow on ${event.dates} at SRGI. All backgrounds welcome. Register and join our WhatsApp community.`,
  openGraph: {
    title: "NASA Space Apps Challenge 2026 | Lucknow",
    description: `${event.dates}. SR Group of Institutions, Lucknow. Bring your curiosity and build with a team.`,
    type: "website",
    locale: "en_IN",
  },
  twitter: { card: "summary" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body className={spaceGrotesk.variable}>
        <a href="#main-content" className="skip-link">Skip to content</a>
        <ScrollProgressBar />
        <NavBar />
        <main id="main-content" tabIndex={-1}>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
