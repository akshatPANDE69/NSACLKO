import type { Replay } from "./engine";

export type RankedRun = { id: string; seed: number; playerId: string };
export type PendingFlight = { run: RankedRun; replay: Replay };

const PENDING_FLIGHT_KEY = "nsac-flappy-bird-pending-flight";

export function readPendingFlight(): PendingFlight | null {
  try {
    const raw = window.sessionStorage.getItem(PENDING_FLIGHT_KEY);
    if (!raw) return null;
    const flight = JSON.parse(raw) as PendingFlight | null;
    if (typeof flight?.run?.id !== "string" || typeof flight.run.playerId !== "string" ||
        !Number.isSafeInteger(flight.replay?.ticks) || !Array.isArray(flight.replay.flaps)) return null;
    return flight;
  } catch { return null; }
}

export function storePendingFlight(flight: PendingFlight | null) {
  try {
    if (flight) window.sessionStorage.setItem(PENDING_FLIGHT_KEY, JSON.stringify(flight));
    else window.sessionStorage.removeItem(PENDING_FLIGHT_KEY);
  } catch { /* The in-memory retry is still available if browser storage is disabled. */ }
}
