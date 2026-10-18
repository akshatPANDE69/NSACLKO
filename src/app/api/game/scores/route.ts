import { z } from "zod";
import { getGooglePlayer } from "@/lib/game/google";
import { GameError, gameFailure, gameResponse, readGameBody, requireSameOrigin } from "@/lib/game/http";
import { getGameStore } from "@/lib/game/store";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    requireSameOrigin(request);
    const player = (await getGooglePlayer(request))!;
    const parsed = z.object({ runId: z.string().uuid(), replay: z.unknown() }).strict().safeParse(await readGameBody(request));
    if (!parsed.success) throw new GameError("Invalid flight submission.");
    const store = getGameStore();
    if (!store) throw new GameError("Ranked play is opening soon. You can still practise.", 503);
    return gameResponse({ score: await store.submit(player, parsed.data.runId, parsed.data.replay), saved: true });
  } catch (error) { return gameFailure(error); }
}
