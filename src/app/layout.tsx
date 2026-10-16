import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NASA Space Apps Challenge 2026 | Lucknow",
  description:
    "Official portal for NASA Space Apps Challenge 2026 Lucknow Chapter. Join the world's largest annual space & science hackathon.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@300;400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ margin: 0, background: "#0d0d10", overflowX: "hidden" }}>
        {children}
      </body>
    </html>
  );
}
