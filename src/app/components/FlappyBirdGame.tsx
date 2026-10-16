"use client";

import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from "react";

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 480;
const BIRD_X = 180;
const BIRD_RADIUS = 17;
const PIPE_WIDTH = 78;
const PIPE_GAP = 158;
const FLOOR_HEIGHT = 34;
const STORAGE_KEY = "nsac-flappy-bird-high-score";

type Pipe = { x: number; gapY: number; scored: boolean };
type Phase = "ready" | "playing" | "gameover";

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
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const phaseRef = useRef<Phase>("ready");
  const birdYRef = useRef(CANVAS_HEIGHT / 2);
  const birdVelocityRef = useRef(0);
  const pipesRef = useRef<Pipe[]>([]);
  const scoreRef = useRef(0);
  const bestRef = useRef(0);
  const [phase, setPhase] = useState<Phase>("ready");
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);

  useEffect(() => {
    try {
      const stored = Number(window.localStorage.getItem(STORAGE_KEY) ?? 0);
      if (Number.isSafeInteger(stored) && stored >= 0) {
        bestRef.current = stored;
        setBest(stored);
      }
    } catch (error) {
      console.warn("Could not load the Flappy Bird high score from local storage.", error);
    }
  }, []);

  const startGame = useCallback(() => {
    birdYRef.current = CANVAS_HEIGHT / 2;
    birdVelocityRef.current = 0;
    pipesRef.current = [
      { x: CANVAS_WIDTH + 140, gapY: 235, scored: false },
      { x: CANVAS_WIDTH + 500, gapY: 285, scored: false },
    ];
    scoreRef.current = 0;
    setScore(0);
    phaseRef.current = "playing";
    setPhase("playing");
  }, []);

  const flap = useCallback(() => {
    if (phaseRef.current === "playing") birdVelocityRef.current = -7.4;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) {
      console.error("Flappy Bird could not start because a 2D canvas context is unavailable.");
      return;
    }

    let frame = 0;
    let previousTime = 0;
    let lastScore = 0;
    let pipeCount = 2;
    const finishGame = () => {
      phaseRef.current = "gameover";
      setPhase("gameover");
      if (scoreRef.current > bestRef.current) {
        bestRef.current = scoreRef.current;
        setBest(scoreRef.current);
        try {
          window.localStorage.setItem(STORAGE_KEY, String(scoreRef.current));
        } catch (error) {
          console.warn("Could not save the Flappy Bird high score to local storage.", error);
        }
      }
    };

    const animate = (time: number) => {
      const delta = previousTime === 0 ? 1 : Math.min((time - previousTime) / (1000 / 60), 2);
      previousTime = time;

      if (phaseRef.current === "playing") {
        birdVelocityRef.current += 0.38 * delta;
        birdYRef.current += birdVelocityRef.current * delta;
        const pipes = pipesRef.current;
        for (const pipe of pipes) {
          pipe.x -= 3.1 * delta;
          const top = pipe.gapY - PIPE_GAP / 2;
          const bottom = pipe.gapY + PIPE_GAP / 2;
          const overlapsBird = BIRD_X + BIRD_RADIUS > pipe.x && BIRD_X - BIRD_RADIUS < pipe.x + PIPE_WIDTH;
          if (overlapsBird && (birdYRef.current - BIRD_RADIUS < top || birdYRef.current + BIRD_RADIUS > bottom)) {
            finishGame();
            break;
          }
          if (!pipe.scored && pipe.x + PIPE_WIDTH < BIRD_X) {
            pipe.scored = true;
            scoreRef.current += 1;
          }
        }

        if (scoreRef.current !== lastScore) {
          lastScore = scoreRef.current;
          setScore(lastScore);
        }
        if (phaseRef.current === "playing" && pipes[pipes.length - 1].x < CANVAS_WIDTH - 380) {
          pipeCount += 1;
          const gapY = 230 + Math.sin(pipeCount * 2.17) * 65;
          pipes.push({ x: CANVAS_WIDTH + 40, gapY, scored: false });
        }
        pipesRef.current = pipes.filter((pipe) => pipe.x + PIPE_WIDTH > -20);
        if (birdYRef.current - BIRD_RADIUS < 0 || birdYRef.current + BIRD_RADIUS > CANVAS_HEIGHT - FLOOR_HEIGHT) {
          finishGame();
        }
      }

      const idleBob = phaseRef.current === "ready" ? Math.sin(time / 280) * 8 : 0;
      drawScene(context, birdYRef.current + idleBob, birdVelocityRef.current, pipesRef.current, scoreRef.current);
      frame = window.requestAnimationFrame(animate);
    };

    frame = window.requestAnimationFrame(animate);
    return () => window.cancelAnimationFrame(frame);
  }, []);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.code !== "Space" && event.code !== "ArrowUp") return;
    event.preventDefault();
    if (phaseRef.current === "ready" || phaseRef.current === "gameover") startGame();
    else flap();
  };

  const handlePointerDown = () => {
    if (phaseRef.current === "ready" || phaseRef.current === "gameover") startGame();
    else flap();
  };

  return (
    <section className="flappy-game" aria-labelledby="flappy-game-title">
      <header className="flappy-game-header">
        <p className="flappy-eyebrow">A little space-apps arcade</p>
        <h1 id="flappy-game-title">Flappy Bird</h1>
        <p>Take flight, dodge the gates, and see how far you can go.</p>
      </header>

      <div className="flappy-scoreboard" aria-label="Scoreboard">
        <div><span>Score</span><strong aria-live="polite">{score}</strong></div>
        <div><span>Personal best</span><strong aria-live="polite">{best}</strong></div>
      </div>

      <div
        className="flappy-play-area"
        onKeyDown={handleKeyDown}
        onPointerDown={handlePointerDown}
        role="group"
        tabIndex={0}
        aria-label="Flappy Bird game. Click or press Space or Arrow Up to fly."
      >
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          aria-hidden="true"
        />
        {phase !== "playing" && (
          <div className="flappy-overlay" aria-live="polite">
            <p>{phase === "ready" ? "Ready for launch?" : "Flight ended"}</p>
            <span>{phase === "ready" ? "Tap, click, or press Space to start" : `You scored ${score}. Take another flight?`}</span>
          </div>
        )}
      </div>

      <div className="flappy-controls">
        <p>Click or tap the game, or press <kbd>Space</kbd> / <kbd>↑</kbd> to flap.</p>
        {phase !== "playing" && (
          <button type="button" className="flappy-start-button" onClick={startGame}>
            {phase === "ready" ? "Start game" : "Play again"}
          </button>
        )}
      </div>
      <p className="flappy-highscore-note">Your personal best is saved in this browser.</p>
    </section>
  );
}
