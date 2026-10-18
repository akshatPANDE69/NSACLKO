import { getGooglePlayer, googleClientId } from "@/lib/game/google";
import { gameFailure, gameResponse } from "@/lib/game/http";
import { getGameStore } from "@/lib/game/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const store = getGameStore();
    if (!store || !googleClientId()) return gameResponse({ available: false, entries: [], personal: null });
    const player = await getGooglePlayer(request, false);
    return gameResponse({ available: true, ...await store.leaderboard(player?.id) });
  } catch (error) { return gameFailure(error); }
}
