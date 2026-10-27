import type { Metadata } from "next";
import { event } from "@/lib/event";

export const metadata: Metadata = {
  title: "Game privacy | NASA Space Apps Lucknow 2026",
  description: "How Google sign in, ranked flights and the NASA Space Apps Lucknow leaderboard use your information.",
};

const sections = [
  {
    title: "Your Google account",
    text: "Google sign in provides your verified account identifier, display name and email address. The game stores a hash of your account identifier, your display name and your email in its private Supabase database. It does not receive your Google password or access your Gmail messages, contacts or Drive files.",
  },
  {
    title: "What other players can see",
    text: "The leaderboard shows the top 20 players by display name, best score and rank. Your email address and account identifier are excluded from public leaderboard responses. Signing in alone does not add an entry. You must complete a ranked flight and score at least one point.",
  },
  {
    title: "Ranked flights and prize review",
    text: "The server stores each ranked flight's random seed, timing, flap inputs and verified score. These records support score validation, ranking and organiser review. Organisers can use your private email to contact you about a prize. Account and flight records remain in the database until organisers remove them.",
  },
  {
    title: "Your browser",
    text: "A Google signed identity token is stored in an HttpOnly session cookie for at most one hour. Signing out removes that session cookie. Your practice personal best is stored separately in this browser and can be removed by clearing the site's browser storage. You can practise without signing in.",
  },
  {
    title: "Services used by the game",
    text: "Google handles account sign in. The website's server verifies your identity and saves ranked game records in Supabase. The public website is hosted on Vercel. Google sign in also follows Google's own privacy practices.",
  },
];

export default function GamePrivacyPage() {
  return (
    <article className="relative z-10 mx-auto min-h-screen max-w-3xl px-6 pb-24 pt-32 text-[#c6c6c6] sm:px-8">
      <a href="/game" className="text-sm underline underline-offset-4 hover:text-white">Return to the game</a>
      <p className="mb-3 mt-10 text-xs uppercase tracking-[0.2em] text-[#aaa]">NASA Space Apps Lucknow Arcade</p>
      <h1 className="mb-6 text-4xl font-light uppercase tracking-wide text-[#eee] sm:text-5xl">Game privacy</h1>
      <p className="mb-10 text-base leading-8">Play as a guest, or sign in with Google to enter ranked flights. Here is how the game uses your information.</p>
      <div className="space-y-8">
        {sections.map((section) => <section key={section.title}>
          <h2 className="mb-3 text-xl font-normal text-[#eee]">{section.title}</h2>
          <p className="text-sm leading-7">{section.text}</p>
        </section>)}
        <section>
          <h2 className="mb-3 text-xl font-normal text-[#eee]">Contact and removal requests</h2>
          <p className="text-sm leading-7">For questions about game records or to request removal of your account and scores, email <a className="break-words underline underline-offset-4 hover:text-white" href={`mailto:${event.email}`}>{event.email}</a>. Organisers handle these requests privately.</p>
        </section>
      </div>
    </article>
  );
}
