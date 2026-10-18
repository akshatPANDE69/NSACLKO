import { getGooglePlayer, googleClientId, issueNonce, newSignInNonce } from "@/lib/game/google";
import { gameFailure, gameResponse } from "@/lib/game/http";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const player = await getGooglePlayer(request, false);
    const clientId = googleClientId();
    const nonce = !player && clientId ? newSignInNonce() : "";
    const response = gameResponse({ user: player ? { id: player.id, name: player.name } : null, clientId, nonce });
    if (nonce) issueNonce(response, nonce);
    return response;
  } catch (error) { return gameFailure(error); }
}
