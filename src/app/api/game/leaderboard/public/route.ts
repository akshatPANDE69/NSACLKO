import { googleClientId } from "@/lib/game/google";
import { gameFailure, gameResponse } from "@/lib/game/http";
import { getGameStore } from "@/lib/game/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const store = getGameStore();
    if (!store || !googleClientId()) return gameResponse({ available: false, entries: [], personal: null });

    // This response is the same for everyone, including requests that carry a session cookie.
    const response = gameResponse({ available: true, ...await store.leaderboard() });
    response.headers.set("Cache-Control", "public, max-age=0, must-revalidate");
    response.headers.set("Vercel-CDN-Cache-Control", "s-maxage=30, stale-while-revalidate=60");
    return response;
  } catch (error) { return gameFailure(error); }
}
