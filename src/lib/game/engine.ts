// One fixed simulation is shared by the canvas and the server replay checker.
export const GAME = {
  width: 800, height: 480, birdX: 180, birdRadius: 17,
  pipeWidth: 78, pipeGap: 158, floorHeight: 34,
  ticksPerSecond: 60, maxTicks: 72_000, maxFlaps: 12_000,
} as const;

export type Pipe = { x: number; gapY: number; scored: boolean };
export type Flight = {
  tick: number; birdY: number; velocity: number; pipes: Pipe[];
  score: number; alive: boolean; random: number;
};
export type Replay = { ticks: number; flaps: number[] };

function nextGap(flight: Flight) {
  let value = flight.random;
  value ^= value << 13;
  value ^= value >>> 17;
  value ^= value << 5;
  flight.random = value >>> 0;
  return 165 + (flight.random / 0x1_0000_0000) * 130;
}

export function createFlight(seed: number): Flight {
  const flight: Flight = {
    tick: 0, birdY: GAME.height / 2, velocity: 0, pipes: [],
    score: 0, alive: true, random: seed >>> 0 || 1,
  };
  flight.pipes = [
    { x: GAME.width + 140, gapY: nextGap(flight), scored: false },
    { x: GAME.width + 500, gapY: nextGap(flight), scored: false },
  ];
  return flight;
}

export function stepFlight(flight: Flight, flap: boolean) {
  if (!flight.alive) return;
  if (flap) flight.velocity = -7.4;
  flight.velocity += 0.38;
  flight.birdY += flight.velocity;
  flight.tick += 1;

  for (const pipe of flight.pipes) pipe.x -= 3.1;
  const outside = flight.birdY - GAME.birdRadius < 0 ||
    flight.birdY + GAME.birdRadius > GAME.height - GAME.floorHeight;
  const hitPipe = flight.pipes.some((pipe) => {
    const overlaps = GAME.birdX + GAME.birdRadius > pipe.x - 7 &&
      GAME.birdX - GAME.birdRadius < pipe.x + GAME.pipeWidth + 7;
    return overlaps && (flight.birdY - GAME.birdRadius < pipe.gapY - GAME.pipeGap / 2 ||
      flight.birdY + GAME.birdRadius > pipe.gapY + GAME.pipeGap / 2);
  });
  if (outside || hitPipe) {
    flight.alive = false;
    return;
  }
  for (const pipe of flight.pipes) {
    if (!pipe.scored && pipe.x + GAME.pipeWidth + 7 < GAME.birdX - GAME.birdRadius) {
      pipe.scored = true;
      flight.score += 1;
    }
  }
  if (flight.pipes[flight.pipes.length - 1].x < GAME.width - 380) {
    flight.pipes.push({ x: GAME.width + 40, gapY: nextGap(flight), scored: false });
  }
  flight.pipes = flight.pipes.filter((pipe) => pipe.x + GAME.pipeWidth > -20);
  if (flight.tick >= GAME.maxTicks) flight.alive = false;
}

export function validateReplay(seed: number, value: unknown, elapsedMs: number) {
  if (!value || typeof value !== "object") throw new Error("Invalid flight replay.");
  const { ticks, flaps } = value as Replay;
  if (!Number.isSafeInteger(ticks) || ticks < 1 || ticks > GAME.maxTicks ||
      !Array.isArray(flaps) || flaps.length > GAME.maxFlaps) {
    throw new Error("Invalid flight length.");
  }
  if (!Number.isFinite(elapsedMs) || elapsedMs < ticks * 1000 / GAME.ticksPerSecond - 1500 ||
      elapsedMs > (GAME.maxTicks / GAME.ticksPerSecond + 300) * 1000) {
    throw new Error("This flight has expired or its timing could not be verified.");
  }
  let previous = -1;
  for (const tick of flaps) {
    if (!Number.isSafeInteger(tick) || tick <= previous || tick < 0 || tick >= ticks) {
      throw new Error("Invalid flight controls.");
    }
    previous = tick;
  }
  const flight = createFlight(seed);
  let index = 0;
  while (flight.alive && flight.tick < ticks) {
    const flap = flaps[index] === flight.tick;
    if (flap) index += 1;
    stepFlight(flight, flap);
  }
  if (flight.alive || flight.tick !== ticks || index !== flaps.length) {
    throw new Error("The flight replay does not match a completed game.");
  }
  return flight.score;
}
