import type { Metadata } from "next";
import { event } from "@/lib/event";
import ScrollProgressBar from "./components/ScrollProgressBar";
import NavBar from "./components/navbar";
import Footer from "./components/footer";
import { Providers } from "./components/Providers";

import "./styles/base.css";
import "./styles/index.css";
import "./styles/timeline.css";
import "./styles/contact.css";
import "./styles/fixes.css";

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
    <html lang="en">
      <body>
        <ScrollProgressBar />
        <NavBar />
        <main id="main-content"><Providers>{children}</Providers></main>
        <Footer />
      </body>
    </html>
  );
}
