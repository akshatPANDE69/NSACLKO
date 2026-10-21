import { NextResponse } from "next/server";

export class GameError extends Error {
  constructor(message: string, public status = 400) { super(message); }
}

export function requireSameOrigin(request: Request) {
  const target = new URL(request.url);
  // Next.js can use an internal hostname for route Request URLs. The Host
  // header is the browser's actual destination and cannot be set by page JS.
  const destination = `${target.protocol}//${request.headers.get("host") || target.host}`;
  if (request.headers.get("origin") !== destination ||
      (request.headers.has("sec-fetch-site") && request.headers.get("sec-fetch-site") !== "same-origin")) {
    throw new GameError("Please use the game on this website to continue.", 403);
  }
}

async function readBoundedText(request: Request, maxBytes: number) {
  if (Number(request.headers.get("content-length")) > maxBytes) throw new GameError("Request is too large.", 413);
  const reader = request.body?.getReader();
  if (!reader) throw new GameError("A request body is required.");
  const chunks: Uint8Array[] = [];
  let length = 0;
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    length += value.byteLength;
    if (length > maxBytes) { await reader.cancel(); throw new GameError("Request is too large.", 413); }
    chunks.push(value);
  }
  const buffer = new Uint8Array(length);
  let offset = 0;
  for (const chunk of chunks) { buffer.set(chunk, offset); offset += chunk.byteLength; }
  return new TextDecoder().decode(buffer);
}

export async function readGameBody(request: Request, maxBytes = 150_000): Promise<unknown> {
  if (!request.headers.get("content-type")?.startsWith("application/json")) throw new GameError("Send JSON to continue.", 415);
  const text = await readBoundedText(request, maxBytes);
  try { return JSON.parse(text); }
  catch { throw new GameError("The request could not be read."); }
}

export async function readGameForm(request: Request, maxBytes = 10_000) {
  if (!request.headers.get("content-type")?.startsWith("application/x-www-form-urlencoded")) {
    throw new GameError("Google sign in could not be read.", 415);
  }
  return new URLSearchParams(await readBoundedText(request, maxBytes));
}

export function gameResponse(body: unknown, status = 200) {
  return NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

export function gameFailure(error: unknown) {
  if (error instanceof GameError) return gameResponse({ error: error.message }, error.status);
  console.error("Game service request failed.");
  return gameResponse({ error: "The leaderboard is temporarily unavailable. Please try again." }, 503);
}
