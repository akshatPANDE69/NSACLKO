import "server-only";
import { nonceCookie, readCookie, sameNonce } from "./google";
import { GameError, readGameForm } from "./http";

export async function readGoogleRedirect(request: Request) {
  const form = await readGameForm(request);
  const csrf = form.get("g_csrf_token") || "";
  const expectedCsrf = readCookie(request, "g_csrf_token");
  if (form.getAll("g_csrf_token").length !== 1 || csrf.length > 512 ||
      !sameNonce(csrf, expectedCsrf)) throw new GameError("Google sign in could not be verified.", 403);
  const nonce = readCookie(request, nonceCookie);
  if (!/^[A-Za-z0-9_-]{43}$/.test(nonce)) throw new GameError("Google sign in expired. Please try again.", 403);
  const credential = form.get("credential") || "";
  if (form.getAll("credential").length !== 1 || !credential || credential.length > 7000) {
    throw new GameError("Google sign in could not be read.");
  }
  return { credential, nonce };
}
