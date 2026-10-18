"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";

import { GAME, createFlight, stepFlight, type Pipe, type Replay } from "@/lib/game/engine";
import { useGameLeaderboard, type RankedRun } from "./useGameLeaderboard";
import GameLeaderboard from "./GameLeaderboard";

const { width: CANVAS_WIDTH, height: CANVAS_HEIGHT, birdX: BIRD_X, birdRadius: BIRD_RADIUS,
  pipeWidth: PIPE_WIDTH, pipeGap: PIPE_GAP, floorHeight: FLOOR_HEIGHT } = GAME;
const STORAGE_KEY = "nsac-flappy-bird-high-score";
type Phase = "ready" | "starting" | "playing" | "gameover";
type Submission = { run: RankedRun; replay: Replay };

function drawScene(
  context: CanvasRenderingContext2D,
  birdY: number,
  birdVelocity: number,
  pipes: Pipe[],
  score: number,
) {
  const sky = context.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
  sky.addColorStop(0, "#07162e");
  sky.addColorStop(1, "#153b56");
  context.fillStyle = sky;
  context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  for (let index = 0; index < 48; index += 1) {
    const x = (index * 167 + 39) % CANVAS_WIDTH;
    const y = (index * 83 + 23) % 335;
    context.globalAlpha = 0.35 + (index % 4) * 0.15;
    context.fillStyle = "#ffffff";
    context.beginPath();
    context.arc(x, y, index % 7 === 0 ? 2 : 1, 0, Math.PI * 2);
    context.fill();
  }
  context.globalAlpha = 1;

  context.fillStyle = "rgba(95, 177, 193, 0.18)";
  context.beginPath();
  context.moveTo(0, 365);
  context.lineTo(165, 285);
  context.lineTo(315, 372);
  context.lineTo(485, 300);
  context.lineTo(650, 375);
  context.lineTo(800, 318);
  context.lineTo(800, CANVAS_HEIGHT - FLOOR_HEIGHT);
  context.lineTo(0, CANVAS_HEIGHT - FLOOR_HEIGHT);
  context.closePath();
  context.fill();

  for (const pipe of pipes) {
    const top = pipe.gapY - PIPE_GAP / 2;
    const bottom = pipe.gapY + PIPE_GAP / 2;
    const gradient = context.createLinearGradient(pipe.x, 0, pipe.x + PIPE_WIDTH, 0);
    gradient.addColorStop(0, "#389b68");
    gradient.addColorStop(0.5, "#71d58f");
    gradient.addColorStop(1, "#287b55");
    context.fillStyle = gradient;
    context.fillRect(pipe.x, 0, PIPE_WIDTH, top);
    context.fillRect(pipe.x, bottom, PIPE_WIDTH, CANVAS_HEIGHT - FLOOR_HEIGHT - bottom);
    context.fillStyle = "#8ae6a2";
    context.fillRect(pipe.x - 7, top - 18, PIPE_WIDTH + 14, 18);
    context.fillRect(pipe.x - 7, bottom, PIPE_WIDTH + 14, 18);
    context.fillStyle = "rgba(0, 0, 0, 0.14)";
    context.fillRect(pipe.x + PIPE_WIDTH - 10, 0, 10, top);
    context.fillRect(pipe.x + PIPE_WIDTH - 10, bottom, 10, CANVAS_HEIGHT - FLOOR_HEIGHT - bottom);
  }

  context.fillStyle = "#223d42";
  context.fillRect(0, CANVAS_HEIGHT - FLOOR_HEIGHT, CANVAS_WIDTH, FLOOR_HEIGHT);
  context.fillStyle = "#83d68d";
  context.fillRect(0, CANVAS_HEIGHT - FLOOR_HEIGHT, CANVAS_WIDTH, 7);
  context.fillStyle = "rgba(255, 255, 255, 0.13)";
  for (let x = 0; x < CANVAS_WIDTH; x += 38) {
    context.fillRect(x, CANVAS_HEIGHT - 18, 18, 3);
  }

  context.save();
  context.translate(BIRD_X, birdY);
  context.rotate(Math.max(-0.45, Math.min(0.65, birdVelocity * 0.055)));
  context.fillStyle = "#ffd166";
  context.beginPath();
  context.ellipse(0, 0, BIRD_RADIUS + 2, BIRD_RADIUS - 2, 0, 0, Math.PI * 2);
  context.fill();
  context.fillStyle = "#f4a340";
  context.beginPath();
  context.ellipse(-5, 5, 9, 6, -0.25, 0, Math.PI * 2);
  context.fill();
  context.fillStyle = "#ff875c";
  context.beginPath();
  context.moveTo(13, 1);
  context.lineTo(28, 5);
  context.lineTo(13, 9);
  context.closePath();
  context.fill();
  context.fillStyle = "#ffffff";
  context.beginPath();
  context.arc(8, -7, 6, 0, Math.PI * 2);
  context.fill();
  context.fillStyle = "#152238";
  context.beginPath();
  context.arc(10, -7, 2.5, 0, Math.PI * 2);
  context.fill();
  context.restore();

  context.textAlign = "center";
  context.font = "700 40px system-ui, sans-serif";
  context.lineWidth = 5;
  context.strokeStyle = "rgba(0, 0, 0, 0.35)";
  context.strokeText(String(score), CANVAS_WIDTH / 2, 64);
  context.fillStyle = "#ffffff";
  context.fillText(String(score), CANVAS_WIDTH / 2, 64);
}

export default function FlappyBirdGame() {
  const leaderboard = useGameLeaderboard();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const playAreaRef = useRef<HTMLDivElement>(null);
  const flightRef = useRef(createFlight(1));
  const phaseRef = useRef<Phase>("ready");
  const pendingFlap = useRef(false);
  const flapTicks = useRef<number[]>([]);
  const runRef = useRef<RankedRun | null>(null);
  const previousTime = useRef(0);
  const accumulator = useRef(0);
  const bestRef = useRef(0);
  const autoRankedUser = useRef("");
  const [phase, setPhase] = useState<Phase>("ready");
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [mode, setMode] = useState<"practice" | "ranked">("practice");
  const [rankedFlight, setRankedFlight] = useState(false);
  const [saving, setSaving] = useState(false);
  const [pending, setPending] = useState<Submission | null>(null);
  const [flightMessage, setFlightMessage] = useState("");
  const [saveFailed, setSaveFailed] = useState(false);

  useEffect(() => {
    try {
      const stored = Number(window.localStorage.getItem(STORAGE_KEY) ?? 0);
      if (Number.isSafeInteger(stored) && stored >= 0) { bestRef.current = stored; setBest(stored); }
    } catch { /* Private browsing may disable local storage. */ }
  }, []);

  useEffect(() => {
    if (leaderboard.user && leaderboard.board?.available && autoRankedUser.current !== leaderboard.user.id) {
      autoRankedUser.current = leaderboard.user.id;
      setMode("ranked");
    } else if (!leaderboard.user) {
      autoRankedUser.current = "";
      setMode("practice");
    }
  }, [leaderboard.user, leaderboard.board?.available]);

  const saveFlight = async (submission: Submission) => {
    setSaving(true);
    setSaveFailed(false);
    setFlightMessage("Checking and saving your flight…");
    try {
      const verifiedScore = await leaderboard.submit(submission.run, submission.replay);
      setPending(null);
      setFlightMessage(verifiedScore > 0 ? `Flight verified. ${verifiedScore} points saved to the leaderboard.` : "Flight verified. Score at least one point to join the leaderboard.");
    } catch (error) {
      setSaveFailed(true);
      setFlightMessage(error instanceof Error ? error.message : "Your score could not be saved. Please try again.");
    } finally { setSaving(false); }
  };

  const finishRef = useRef(() => {});
  finishRef.current = () => {
    phaseRef.current = "gameover";
    setPhase("gameover");
    const flight = flightRef.current;
    setScore(flight.score);
    if (flight.score > bestRef.current) {
      bestRef.current = flight.score;
      setBest(flight.score);
      try { window.localStorage.setItem(STORAGE_KEY, String(flight.score)); }
      catch { /* The flight is still playable without browser storage. */ }
    }
    if (runRef.current) {
      const submission = { run: runRef.current, replay: { ticks: flight.tick, flaps: [...flapTicks.current] } };
      runRef.current = null;
      setPending(submission);
      void saveFlight(submission);
    }
  };

  const startGame = async () => {
    if (phaseRef.current === "playing" || phaseRef.current === "starting" || pending || saving) return;
    setFlightMessage("");
    setSaveFailed(false);
    let run: RankedRun | null = null;
    if (mode === "ranked") {
      phaseRef.current = "starting";
      setPhase("starting");
      try { run = await leaderboard.startRanked(); }
      catch (error) {
        phaseRef.current = "ready";
        setPhase("ready");
        setFlightMessage(error instanceof Error ? error.message : "Ranked flight could not start. Please try again.");
        return;
      }
    }
    const seed = run?.seed ?? (window.crypto.getRandomValues(new Uint32Array(1))[0] || 1);
    runRef.current = run;
    flightRef.current = createFlight(seed);
    setRankedFlight(Boolean(run));
    pendingFlap.current = true;
    flapTicks.current = [];
    previousTime.current = 0;
    accumulator.current = 0;
    setScore(0);
    phaseRef.current = "playing";
    setPhase("playing");
    playAreaRef.current?.focus({ preventScroll: true });
  };

  useEffect(() => {
    const context = canvasRef.current?.getContext("2d");
    if (!context) return;
    let frame = 0;
    let displayedScore = 0;
    const stepMs = 1000 / GAME.ticksPerSecond;
    const animate = (time: number) => {
      const elapsed = previousTime.current ? Math.min(time - previousTime.current, 250) : 0;
      previousTime.current = time;
      const flight = flightRef.current;
      if (phaseRef.current === "playing") {
        accumulator.current += elapsed;
        while (accumulator.current >= stepMs && flight.alive) {
          const flap = pendingFlap.current && flapTicks.current.length < GAME.maxFlaps;
          if (flap) flapTicks.current.push(flight.tick);
          pendingFlap.current = false;
          stepFlight(flight, flap);
          accumulator.current -= stepMs;
        }
        if (flight.score !== displayedScore) { displayedScore = flight.score; setScore(flight.score); }
        if (!flight.alive) finishRef.current();
      }
      const idleBob = phaseRef.current === "ready" ? Math.sin(time / 280) * 8 : 0;
      drawScene(context, flight.birdY + idleBob, flight.velocity, flight.pipes, flight.score);
      frame = window.requestAnimationFrame(animate);
    };
    frame = window.requestAnimationFrame(animate);
    return () => window.cancelAnimationFrame(frame);
  }, []);

  const flapOrStart = () => {
    if (phaseRef.current === "playing") pendingFlap.current = true;
    else if (phaseRef.current !== "starting") void startGame();
  };
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.code !== "Space" && event.code !== "ArrowUp") return;
    event.preventDefault();
    if (!event.repeat) flapOrStart();
  };
  const busy = phase === "playing" || phase === "starting" || saving;

  return (
    <section className="flappy-game" aria-labelledby="flappy-game-title">
      <header className="flappy-game-header">
        <p className="flappy-eyebrow">NASA Space Apps Lucknow arcade</p>
        <h1 id="flappy-game-title">Flappy Bird</h1>
        <p>One more gate. One better flight. A shot at the top.</p>
      </header>
      <div className="flappy-layout">
        <div className="flappy-flight">
          <div className="flappy-scoreboard" aria-label="Scoreboard">
            <div><span>Score</span><strong>{score}</strong></div>
            <div><span>Personal best</span><strong>{best}</strong></div>
          </div>
          <div className="flappy-mode" aria-label="Choose game mode">
            <div><button type="button" aria-pressed={mode === "practice"} disabled={busy || Boolean(pending)} onClick={() => setMode("practice")}>Practice</button><button type="button" aria-pressed={mode === "ranked"} disabled={busy || Boolean(pending) || !leaderboard.user || !leaderboard.board?.available} onClick={() => setMode("ranked")}>Ranked flight</button></div>
            <span>{mode === "ranked" ? "Your best flight counts" : "Sign in to compete"}</span>
          </div>
          <div ref={playAreaRef} className="flappy-play-area" onKeyDown={handleKeyDown} onPointerDown={() => { playAreaRef.current?.focus({ preventScroll: true }); flapOrStart(); }} role="group" tabIndex={0} aria-label="Flappy Bird game. Click or press Space or Arrow Up to fly.">
            <canvas ref={canvasRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} aria-hidden="true" />
            {phase !== "playing" && <div className="flappy-overlay" aria-live="polite">
              <p>{phase === "starting" ? "Preparing your flight…" : phase === "ready" ? "Ready for launch?" : "Flight ended"}</p>
              <span>{phase === "starting" ? "Setting up your ranked game" : phase === "ready" ? "Tap, click, or press Space to start" : `${rankedFlight ? "Ranked flight" : "Practice flight"} · ${score} points`}</span>
            </div>}
          </div>
          <div className="flappy-controls">
            <p>Click or tap, or press <kbd>Space</kbd> / <kbd>↑</kbd> to flap.</p>
            {phase !== "playing" && !pending && <button type="button" className="flappy-start-button" disabled={busy} onClick={() => void startGame()}>{phase === "starting" ? "Preparing…" : phase === "ready" ? "Start game" : "Play again"}</button>}
          </div>
          {flightMessage && <p className={`flappy-flight-message${saveFailed ? " flappy-save-error" : ""}`} role="status">{flightMessage}</p>}
          {saveFailed && pending && <div className="flappy-retry"><button type="button" className="flappy-start-button" disabled={saving} onClick={() => void saveFlight(pending)}>Retry saving score</button><button type="button" className="flappy-text-button" disabled={saving} onClick={() => { setPending(null); setFlightMessage(""); setSaveFailed(false); }}>Discard unsaved flight</button></div>}
          <p className="flappy-highscore-note">Personal best is saved in this browser. Only flights started in ranked mode join the leaderboard.</p>
        </div>
        <GameLeaderboard leaderboard={leaderboard} flightActive={busy} />
      </div>
    </section>
  );
}
