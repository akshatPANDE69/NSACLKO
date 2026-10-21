import "server-only";
import { createHash, randomBytes, timingSafeEqual } from "node:crypto";
import { OAuth2Client, type TokenPayload } from "google-auth-library";
import type { NextResponse } from "next/server";
import { GameError } from "./http";

export type GamePlayer = { id: string; name: string; email: string };
const google = new OAuth2Client();
const secure = process.env.NODE_ENV === "production";
export const sessionCookie = secure ? "__Host-nsac-game" : "nsac-game";
export const nonceCookie = secure ? "__Host-nsac-game-nonce" : "nsac-game-nonce";
const cookieOptions = { httpOnly: true, secure, sameSite: "lax" as const, path: "/" };
// Google's full page flow returns a cross site POST. Only the short lived,
// anonymous nonce needs SameSite=None; the authenticated session stays Lax.
const nonceOptions = { ...cookieOptions, sameSite: secure ? "none" as const : "lax" as const };

export function googleClientId() { return process.env.GOOGLE_CLIENT_ID || ""; }

export function readCookie(request: Request, name: string) {
  return request.headers.get("cookie")?.split(";").map((part) => part.trim())
    .find((part) => part.startsWith(`${name}=`))?.slice(name.length + 1) ?? "";
}

export function sameNonce(actual: string, expected: string) {
  const left = Buffer.from(actual);
  const right = Buffer.from(expected);
  return left.length > 0 && left.length === right.length && timingSafeEqual(left, right);
}

export async function verifyGoogleCredential(
  credential: string,
  expectedNonce?: string,
  verify = async (token: string, audience: string) => (await google.verifyIdToken({ idToken: token, audience })).getPayload(),
) {
  const clientId = googleClientId();
  if (!clientId) throw new GameError("Google sign in is opening soon. You can still practise.", 503);
  if (credential.length > 7000 || credential.split(".").length !== 3) throw new GameError("Please sign in with Google again.", 401);
  let payload: TokenPayload | undefined;
  try { payload = await verify(credential, clientId); }
  catch { throw new GameError("Please sign in with Google again.", 401); }
  if (!payload?.sub || payload.email_verified !== true || !payload.email ||
      !payload.exp || payload.exp <= Date.now() / 1000) throw new GameError("Please use a verified Google account.", 401);
  if (expectedNonce !== undefined && !sameNonce(String((payload as TokenPayload & { nonce?: string }).nonce ?? ""), expectedNonce)) {
    throw new GameError("Google sign in expired. Refresh the page and try again.", 403);
  }
  const name = payload.name?.replace(/[\u0000-\u001f\u007f-\u009f]/g, "").trim().slice(0, 60) || "Space Explorer";
  return {
    player: { id: createHash("sha256").update(`google:${payload.sub}`).digest("hex"), name, email: payload.email },
    expiresAt: payload.exp,
  };
}

export async function getGooglePlayer(request: Request, required = true): Promise<GamePlayer | null> {
  const credential = readCookie(request, sessionCookie);
  if (!credential && !required) return null;
  if (!credential) throw new GameError("Sign in with Google to join the leaderboard.", 401);
  try { return (await verifyGoogleCredential(credential)).player; }
  catch (error) { if (!required) return null; throw error; }
}

export function newSignInNonce() { return randomBytes(32).toString("base64url"); }

export function signInNonce(request: Request) {
  const existing = readCookie(request, nonceCookie);
  return /^[A-Za-z0-9_-]{43}$/.test(existing) ? existing : newSignInNonce();
}

export function issueNonce(response: NextResponse, nonce: string) {
  response.cookies.set(nonceCookie, nonce, { ...nonceOptions, maxAge: 300 });
}

export function saveGoogleSession(response: NextResponse, credential: string, expiresAt: number) {
  // Google's signed ID token is checked on every authenticated request. It is
  // never exposed by our API or used as a Google API access token.
  response.cookies.set(sessionCookie, credential, { ...cookieOptions, maxAge: Math.min(3600, Math.floor(expiresAt - Date.now() / 1000)) });
  response.cookies.set(nonceCookie, "", { ...nonceOptions, maxAge: 0 });
}

export function clearGoogleSession(response: NextResponse) {
  response.cookies.set(sessionCookie, "", { ...cookieOptions, maxAge: 0 });
  response.cookies.set(nonceCookie, "", { ...nonceOptions, maxAge: 0 });
}
