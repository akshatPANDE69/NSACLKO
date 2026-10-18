import { getGooglePlayer } from "@/lib/game/google";
import { GameError, gameFailure, gameResponse, requireSameOrigin } from "@/lib/game/http";
import { getGameStore } from "@/lib/game/store";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    requireSameOrigin(request);
    const player = (await getGooglePlayer(request))!;
    const store = getGameStore();
    if (!store) throw new GameError("Ranked play is opening soon. You can still practise.", 503);
    return gameResponse(await store.start(player), 201);
  } catch (error) { return gameFailure(error); }
}
