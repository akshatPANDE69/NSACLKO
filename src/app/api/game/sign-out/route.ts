import { clearGoogleSession } from "@/lib/game/google";
import { gameFailure, gameResponse, requireSameOrigin } from "@/lib/game/http";

export async function POST(request: Request) {
  try {
    requireSameOrigin(request);
    const response = gameResponse({ signedOut: true });
    clearGoogleSession(response);
    return response;
  } catch (error) { return gameFailure(error); }
}
