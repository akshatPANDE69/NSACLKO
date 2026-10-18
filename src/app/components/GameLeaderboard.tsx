"use client";

import { Trophy } from "lucide-react";
import type { useGameLeaderboard } from "./useGameLeaderboard";
import GameGoogleSignIn from "./GameGoogleSignIn";

type Props = { leaderboard: ReturnType<typeof useGameLeaderboard>; flightActive: boolean };

export default function GameLeaderboard({ leaderboard, flightActive }: Props) {
  const { user, googleConfig, board, authBusy, refreshing, error, signIn, signOut, refresh } = leaderboard;
  const name = user?.name || "Space Explorer";
  return (
    <aside className="flappy-leaderboard" aria-labelledby="leaderboard-title">
      <div className="flappy-prize">
        <Trophy size={25} strokeWidth={1.4} aria-hidden="true" />
        <p className="flappy-eyebrow">Play for the top spot</p>
        <h2>A surprise awaits <span>No. 1.</span></h2>
        <p>First place wins a surprise prize. Open to everyone. Bring your best flight.</p>
      </div>

      <div className="flappy-account">
        {user ? (
          <>
            <div className="flappy-player"><span aria-hidden="true">{String(name).slice(0, 1).toUpperCase()}</span><p>Flying as<strong>{name}</strong></p></div>
            <button type="button" className="flappy-text-button" onClick={() => void signOut()} disabled={authBusy || flightActive}>Sign out</button>
          </>
        ) : (
          <>
            <p>Make your next high score count.</p>
            {googleConfig && board?.available ? <GameGoogleSignIn {...googleConfig} busy={authBusy} onCredential={(credential) => void signIn(credential)} /> : <button type="button" className="flappy-google-button" disabled>Sign in with Google</button>}
            <p className="flappy-privacy">Your Google display name and best score will appear publicly. Your email stays private and helps us contact the prize winner. Sign in only if you agree.</p>
          </>
        )}
      </div>

      <div className="flappy-board-heading"><h2 id="leaderboard-title">Leaderboard</h2><button type="button" className="flappy-text-button" onClick={() => void refresh()} disabled={refreshing}>{refreshing ? "Loading…" : "Refresh"}</button></div>
      {error ? <p className="flappy-board-message" role="alert">{error}</p> : !board ? <p className="flappy-board-message" role="status">Loading the leaderboard…</p> : !board.available ? (
        <p className="flappy-board-message">Ranked play is opening soon. You can practise in the meantime.</p>
      ) : board.entries.length === 0 ? (
        <div className="flappy-board-empty"><span aria-hidden="true">01</span><p>The top spot is yours to claim.</p><p>Sign in and score your first point to join the leaderboard.</p></div>
      ) : (
        <table className="flappy-board-table">
          <caption className="sr-only">Top 20 players, highest score first</caption>
          <thead><tr><th scope="col">Rank</th><th scope="col">Player</th><th scope="col">Score</th></tr></thead>
          <tbody>{board.entries.map((entry) => <tr key={entry.rank} className={`${entry.rank === 1 ? "flappy-leader" : ""} ${entry.isYou ? "flappy-you" : ""}`}>
            <td>{entry.rank === 1 ? <Trophy size={15} aria-label="First place" /> : String(entry.rank).padStart(2, "0")}</td><th scope="row">{entry.name}{entry.isYou && <span>you</span>}</th><td>{entry.score}</td>
          </tr>)}</tbody>
        </table>
      )}
      {board?.personal && <p className="flappy-personal-rank">Your best: {board.personal.score} · Rank {board.personal.rank}</p>}
      <p className="flappy-ranking-note">Your best ranked score counts. Equal scores are ordered by who reached the score first. The organisers will review the winning flight before awarding the prize.<br /><a href="/game/privacy" className="flappy-text-button">Game privacy notice</a></p>
    </aside>
  );
}
