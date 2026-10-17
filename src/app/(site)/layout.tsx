import type { Metadata } from "next";
import { event } from "@/lib/event";
import ScrollProgressBar from "@/app/components/ScrollProgressBar";
import NavBar from "@/app/components/navbar";
import Footer from "@/app/components/footer";
import { Providers } from "@/app/components/Providers";
import SiteBackground from "@/app/components/SiteBackground";

import "@/app/styles/base.css";
import "@/app/styles/index.css";
import "@/app/styles/timeline.css";
import "@/app/styles/contact.css";
import "@/app/styles/fixes.css";

export const metadata: Metadata = {
  title: "NASA Space Apps Challenge 2026 | Lucknow",
  description: `Join NASA Space Apps Challenge in Lucknow on ${event.dates} at SRGI. All streams and experience levels are welcome.`,
  icons: { icon: "/globe.svg" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body className="site-shell">
        <SiteBackground />
        <a href="#main-content" className="skip-link">Skip to content</a>
        <ScrollProgressBar />
        <NavBar />
        <main id="main-content" tabIndex={-1}><Providers>{children}</Providers></main>
        <Footer />
      </body>
    </html>
  );
}
