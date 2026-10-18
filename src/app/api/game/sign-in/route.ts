import { z } from "zod";
import { nonceCookie, readCookie, sameNonce, saveGoogleSession, verifyGoogleCredential } from "@/lib/game/google";
import { GameError, gameFailure, gameResponse, readGameBody, requireSameOrigin } from "@/lib/game/http";
import { getGameStore } from "@/lib/game/store";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    requireSameOrigin(request);
    const parsed = z.object({ credential: z.string().max(7000), nonce: z.string().max(100) }).strict().safeParse(await readGameBody(request, 10_000));
    if (!parsed.success) throw new GameError("Google sign in could not be read.");
    const expected = readCookie(request, nonceCookie);
    if (!sameNonce(parsed.data.nonce, expected)) throw new GameError("Google sign in expired. Please try again.", 403);
    const { player, expiresAt } = await verifyGoogleCredential(parsed.data.credential, expected);
    await getGameStore()?.rememberPlayer(player);
    const response = gameResponse({ user: { id: player.id, name: player.name } });
    saveGoogleSession(response, parsed.data.credential, expiresAt);
    return response;
  } catch (error) { return gameFailure(error); }
}
