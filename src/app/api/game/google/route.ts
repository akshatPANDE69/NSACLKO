import { NextResponse } from "next/server";
import { saveGoogleSession, verifyGoogleCredential } from "@/lib/game/google";
import { readGoogleRedirect } from "@/lib/game/google-redirect";
import { GameError } from "@/lib/game/http";
import { getGameStore } from "@/lib/game/store";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const destination = new URL("/game", request.url);
  try {
    const { credential, nonce } = await readGoogleRedirect(request);
    const { player, expiresAt } = await verifyGoogleCredential(credential, nonce);
    const store = getGameStore();
    if (!store) throw new GameError("The leaderboard is temporarily unavailable.", 503);
    await store.rememberPlayer(player);
    const response = NextResponse.redirect(destination, 303);
    response.headers.set("Cache-Control", "no-store");
    saveGoogleSession(response, credential, expiresAt);
    return response;
  } catch {
    destination.searchParams.set("signin", "failed");
    return NextResponse.redirect(destination, { status: 303, headers: { "Cache-Control": "no-store" } });
  }
}
