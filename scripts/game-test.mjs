import assert from "node:assert/strict";
import { generateKeyPairSync, sign } from "node:crypto";
import { readFile } from "node:fs/promises";
import { OAuth2Client } from "google-auth-library";
import { createServer } from "node:http";
import { once } from "node:events";
import { createClient } from "@supabase/supabase-js";
import { PGlite } from "@electric-sql/pglite";
import { GAME, createFlight, stepFlight, validateReplay } from "../src/lib/game/engine.ts";
import { verifyGoogleCredential, sameNonce, readCookie, saveGoogleSession, sessionCookie, nonceCookie, issueNonce, signInNonce } from "../src/lib/game/google.ts";
import { GoogleRedirectError, readGoogleRedirect } from "../src/lib/game/google-redirect.ts";
import { gameResponse, requireSameOrigin, readGameBody } from "../src/lib/game/http.ts";
import { GameStore } from "../src/lib/game/store.ts";

function completeFlight(seed, goal = 4) {
  const flight = createFlight(seed);
  const flaps = [];
  while (flight.alive) {
    const pipe = flight.pipes.find((pipe) => pipe.x + GAME.pipeWidth + 7 >= GAME.birdX - GAME.birdRadius);
    const flap = flight.score < goal && flight.birdY > (pipe?.gapY ?? 230) + 12 && flight.velocity > 0;
    if (flap) flaps.push(flight.tick);
    stepFlight(flight, flap);
  }
  assert.equal(flight.score, goal);
  return { ticks: flight.tick, flaps };
}

const seed = 384761;
const replay = completeFlight(seed);
const elapsed = replay.ticks * 1000 / 60 + 50;
assert.equal(validateReplay(seed, replay, elapsed), 4);
assert.throws(() => validateReplay(seed, replay, 0), /timing/);
assert.throws(() => validateReplay(seed, replay, 2_000_000), /expired/);
assert.throws(() => validateReplay(seed, { ...replay, ticks: replay.ticks - 1 }, elapsed), /completed/);
assert.throws(() => validateReplay(seed, { ...replay, ticks: replay.ticks + 1 }, elapsed), /completed/);
for (const flaps of [[10, 10], [8, 7], [-1], [0.5]]) {
  assert.throws(() => validateReplay(seed, { ...replay, flaps }, elapsed), /controls/);
}
assert.throws(() => validateReplay(seed, { ticks: GAME.maxTicks + 1, flaps: [] }, elapsed), /length/);
assert.throws(() => validateReplay(seed, { ticks: 20, flaps: Array(GAME.maxFlaps + 1).fill(0) }, elapsed), /length/);
assert.equal(validateReplay(seed, { ...replay, score: 999999 }, elapsed), 4, "Client scores are never trusted");
const idle = createFlight(seed);
while (idle.alive) stepFlight(idle, false);
assert.equal(validateReplay(seed, { ticks: idle.tick, flaps: [] }, 5000), 0);
console.log("PASS flight validation: completed games, fabricated scores, timing, truncation and invalid controls");

// Verify actual RSA signatures using Google's verification library and a local
// fixture certificate. No real Google account or Google token is used.
process.env.GOOGLE_CLIENT_ID = "test-web-client.apps.googleusercontent.com";
const { privateKey, publicKey } = generateKeyPairSync("rsa", { modulusLength: 2048 });
const verifier = new OAuth2Client();
const verifyFixture = async (token, audience) => (await verifier.verifySignedJwtWithCertsAsync(
  token, { fixture: publicKey.export({ type: "spki", format: "pem" }) }, audience, ["https://accounts.google.com", "accounts.google.com"],
)).getPayload();
const now = Math.floor(Date.now() / 1000);
const nonce = "test-random-browser-nonce";
const claims = { iss: "https://accounts.google.com", aud: process.env.GOOGLE_CLIENT_ID, sub: "test-google-subject", iat: now, exp: now + 3500,
  email: "player@example.test", email_verified: true, name: "Test Player", nonce };
const makeToken = (payload) => {
  const content = [Buffer.from(JSON.stringify({ alg: "RS256", kid: "fixture" })).toString("base64url"), Buffer.from(JSON.stringify(payload)).toString("base64url")].join(".");
  return content + "." + sign("RSA-SHA256", Buffer.from(content), privateKey).toString("base64url");
};
const token = makeToken(claims);
const verified = await verifyGoogleCredential(token, nonce, verifyFixture);
assert.equal(verified.player.name, "Test Player");
assert.notEqual(verified.player.id, claims.sub);
assert.equal(verified.player.email, claims.email);
await assert.rejects(verifyGoogleCredential(token, "wrong-browser", verifyFixture), /expired/);
for (const patch of [{ aud: "wrong-app" }, { iss: "https://attacker.example" }, { exp: now - 3600, iat: now - 7200 }, { email_verified: false }]) {
  await assert.rejects(verifyGoogleCredential(makeToken({ ...claims, ...patch }), nonce, verifyFixture));
}
const tampered = token.split(".");
tampered[1] = Buffer.from(JSON.stringify({ ...claims, sub: "impersonated" })).toString("base64url");
await assert.rejects(verifyGoogleCredential(tampered.join("."), nonce, verifyFixture));
assert.ok(sameNonce(nonce, nonce));
assert.ok(!sameNonce("", ""));
assert.ok(!sameNonce(nonce, "wrong"));
assert.equal(readCookie(new Request("https://example.test", { headers: { cookie: "other=x; wanted=exact; unwanted=no" } }), "wanted"), "exact");
for (const origin of [null, "https://attacker.example"]) {
  const request = new Request("https://example.test/api/game/runs", { method: "POST", headers: origin ? { origin } : {} });
  assert.throws(() => requireSameOrigin(request), (error) => error.status === 403);
}
requireSameOrigin(new Request("https://example.test/api/game/runs", { method: "POST", headers: { origin: "https://example.test" } }));
requireSameOrigin(new Request("http://localhost:3000/api/game/runs", { method: "POST", headers: { host: "127.0.0.1:3000", origin: "http://127.0.0.1:3000" } }));
const session = gameResponse({ ok: true });
saveGoogleSession(session, token, now + 3500);
assert.equal(session.cookies.get(sessionCookie).value, token);
assert.ok(session.headers.get("set-cookie").includes("HttpOnly"));
assert.ok(session.headers.get("set-cookie").includes("SameSite=lax"));
await assert.rejects(readGameBody(new Request("https://example.test", { method: "POST", body: "not json" })), (error) => error.status === 415);
await assert.rejects(readGameBody(new Request("https://example.test", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text: "x".repeat(200) }) }), 100), (error) => error.status === 413);
console.log("PASS Google identity: RSA signatures, audience, issuer, expiry, verified email, browser nonce, HttpOnly sessions and request bounds");

const redirectNonce = "a".repeat(43);
const redirectCredential = makeToken({ ...claims, nonce: redirectNonce });
const googleForm = (fields = {}, cookies = `g_csrf_token=fixture-csrf; ${nonceCookie}=${redirectNonce}`) => new Request("https://example.test/api/game/google", {
  method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded", Cookie: cookies },
  body: new URLSearchParams({ credential: redirectCredential, g_csrf_token: "fixture-csrf", ...fields }),
});
const redirect = await readGoogleRedirect(googleForm());
assert.equal((await verifyGoogleCredential(redirect.credential, redirect.nonce, verifyFixture)).player.email, claims.email);
for (const cookies of ["", `${nonceCookie}=${redirectNonce}`, `g_csrf_token=wrong; ${nonceCookie}=${redirectNonce}`, "g_csrf_token=fixture-csrf"]) {
  await assert.rejects(readGoogleRedirect(googleForm({}, cookies)), (error) => error.status === 403);
}
await assert.rejects(readGoogleRedirect(googleForm({}, "g_csrf_token=fixture-csrf")),
  (error) => error instanceof GoogleRedirectError && error.reason === "expired");
await assert.rejects(readGoogleRedirect(googleForm({}, `${nonceCookie}=${redirectNonce}`)),
  (error) => error instanceof GoogleRedirectError && error.reason === "cookies");
await assert.rejects(readGoogleRedirect(googleForm({ g_csrf_token: "wrong" })), (error) => error.status === 403);
await assert.rejects(readGoogleRedirect(googleForm({ credential: "x".repeat(7001) })), /could not be read/);
await assert.rejects(readGoogleRedirect(googleForm({ extra: "x".repeat(10001) })), (error) => error.status === 413);
await assert.rejects(readGoogleRedirect(new Request("https://example.test/api/game/google", {
  method: "POST", headers: { "Content-Type": "application/json" }, body: "{}",
})), (error) => error.status === 415);
for (const duplicated of ["g_csrf_token", "credential"]) {
  const request = googleForm();
  const body = new URLSearchParams(await request.text());
  body.append(duplicated, body.get(duplicated));
  await assert.rejects(readGoogleRedirect(new Request(request.url, { method: "POST", headers: request.headers, body })));
}
const sharedNonceRequest = new Request("https://example.test", { headers: { Cookie: `${nonceCookie}=${redirectNonce}` } });
assert.equal(signInNonce(sharedNonceRequest), redirectNonce, "Opening another game tab must not invalidate an existing sign in");
assert.match(signInNonce(new Request("https://example.test")), /^[A-Za-z0-9_-]{43}$/);
const nonceResponse = gameResponse({});
issueNonce(nonceResponse, redirectNonce);
assert.equal(nonceResponse.cookies.get(nonceCookie).httpOnly, true);
assert.equal(nonceResponse.cookies.get(nonceCookie).sameSite, process.env.NODE_ENV === "production" ? "none" : "lax");
console.log("PASS Google full page sign in: signed identity, CSRF cookie and form token, browser nonce, multiple tabs and request bounds");

// Execute the actual migration in PostgreSQL and exercise the Supabase SDK's
// HTTP protocol against it. All profiles and credentials are synthetic fixtures.
const db = new PGlite();
await db.exec("create role anon; create role authenticated; create role service_role bypassrls;");
await db.exec(await readFile(new URL("../supabase/migrations/202610180001_game_leaderboard.sql", import.meta.url), "utf8"));
for (const role of ["anon", "authenticated"]) {
  await db.exec(`set role ${role}`);
  for (const table of ["game_players", "game_runs", "game_scores"]) {
    await assert.rejects(db.query(`select * from public.${table}`), /permission denied/);
    await assert.rejects(db.query(`delete from public.${table}`), /permission denied/);
  }
  await assert.rejects(db.query("select public.get_game_leaderboard(null)"), /permission denied/);
  await assert.rejects(db.query("select public.start_game_run($1, 1, 'Forged', 'fake@example.test')", ["a".repeat(64)]), /permission denied/);
  await assert.rejects(db.query("select public.finish_game_run($1, gen_random_uuid(), 99999, 100, '[]')", ["a".repeat(64)]), /permission denied/);
  await db.exec("reset role");
}
assert.equal((await db.query("select relname from pg_class where relname in ('game_players','game_runs','game_scores') and relrowsecurity")).rows.length, 3);
await db.exec("set role service_role");
const fixture = createServer(async (request, response) => {
  const send = (status, body) => { response.writeHead(status, { "Content-Type": "application/json" }); response.end(JSON.stringify(body)); };
  try {
    assert.equal(request.headers.apikey, "test-server-secret");
    assert.equal(request.headers.authorization, "Bearer test-server-secret");
    const url = new URL(request.url, "http://localhost");
    if (url.pathname === "/rest/v1/game_runs") {
      const result = await db.query("select id, seed, created_at, status, score from public.game_runs where id=$1 and player_id=$2", [url.searchParams.get("id").slice(3), url.searchParams.get("player_id").slice(3)]);
      return send(200, result.rows);
    }
    let raw = "";
    for await (const part of request) raw += part;
    const args = JSON.parse(raw || "{}");
    if (url.pathname === "/rest/v1/game_players") {
      await db.query("insert into public.game_players (player_id, display_name, email) values ($1,$2,$3) on conflict (player_id) do update set display_name=excluded.display_name, email=excluded.email", [args.player_id,args.display_name,args.email]);
      return send(200, null);
    }
    let result;
    if (url.pathname === "/rest/v1/rpc/start_game_run") {
      result = await db.query("select public.start_game_run($1,$2,$3,$4) as result", [args.p_user,args.p_seed,args.p_name,args.p_email]);
    } else if (url.pathname === "/rest/v1/rpc/finish_game_run") {
      result = await db.query("select public.finish_game_run($1,$2,$3,$4,$5::jsonb) as result", [args.p_user,args.p_run,args.p_score,args.p_ticks,JSON.stringify(args.p_flaps)]);
    } else if (url.pathname === "/rest/v1/rpc/get_game_leaderboard") {
      result = await db.query("select public.get_game_leaderboard($1) as result", [args.p_user]);
    } else return send(404, {message:"Unknown fixture endpoint"});
    return send(200, result.rows[0].result);
  } catch (error) { return send(400, {message:error.message}); }
});
fixture.listen(0, "127.0.0.1");
await once(fixture, "listening");
const database = createClient(`http://127.0.0.1:${fixture.address().port}`, "test-server-secret", {auth:{persistSession:false,autoRefreshToken:false}});
const store = new GameStore(database);
const alice = { id: "a".repeat(64), name: "Test Player A", email: "alice@example.test" };
const bob = { id: "b".repeat(64), name: "Test Player B", email: "bob@example.test" };
const zero = { id: "c".repeat(64), name: "Test Player Zero", email: "zero@example.test" };
const ageRun = (run, replay) => db.query("update public.game_runs set created_at=clock_timestamp()-($1 * interval '1 millisecond') where id=$2", [replay.ticks*1000/60+100,run.id]);
const play = async (player, score) => {
  const run = await store.start(player);
  const replay = completeFlight(run.seed, score);
  await ageRun(run, replay);
  return {run,replay};
};
try {
  await store.rememberPlayer(alice);
  assert.deepEqual((await store.leaderboard()).entries, []);
  const first = await store.start(alice);
  const firstReplay = completeFlight(first.seed, 3);
  await assert.rejects(store.submit(bob, first.id, firstReplay), (error) => error.status === 404);
  await assert.rejects(store.submit(alice, first.id, firstReplay), (error) => error.status === 422);
  await ageRun(first, firstReplay);
  assert.deepEqual(await Promise.all([store.submit(alice, first.id, firstReplay), store.submit(alice, first.id, firstReplay)]), [3,3]);
  assert.equal(await store.submit(alice, first.id, {score:999999}), 3);
  assert.equal((await db.query("select count(*)::integer as count from public.game_scores")).rows[0].count, 1);
  assert.equal((await db.query("select last_value::integer as value from public.game_score_order")).rows[0].value, 1);
  const lower = await play(alice, 1);
  await store.submit(alice, lower.run.id, lower.replay);
  assert.equal((await store.leaderboard(alice.id)).personal.score, 3);
  const tied = await play(bob, 3);
  await store.submit(bob, tied.run.id, tied.replay);
  let board = await store.leaderboard(alice.id);
  assert.deepEqual(board.entries.map((entry) => entry.name), [alice.name,bob.name]);
  assert.equal(board.entries[0].isYou, true);
  assert.equal(board.personal.rank, 1);
  const ownTie = await play(alice, 3);
  await store.submit(alice, ownTie.run.id, ownTie.replay);
  assert.equal((await store.leaderboard()).entries[0].name, alice.name);
  const improved = await play(bob, 4);
  await store.submit(bob, improved.run.id, improved.replay);
  board = await store.leaderboard(alice.id);
  assert.equal(board.entries[0].name, bob.name);
  assert.equal(board.personal.rank, 2);
  assert.deepEqual(Object.keys(board.entries[0]).sort(), ["isYou","name","rank","score"]);
  assert.ok(!JSON.stringify(board).includes("@example.test"));
  assert.ok(!JSON.stringify(board).includes(alice.id));
  assert.equal((await db.query("select email from public.game_players where player_id=$1", [alice.id])).rows[0].email, alice.email);
  const zeroRun = await play(zero, 0);
  await store.submit(zero, zeroRun.run.id, zeroRun.replay);
  assert.equal((await store.leaderboard(zero.id)).personal, null);
  const replaced = await play(zero, 1);
  await store.start(zero);
  await assert.rejects(store.submit(zero, replaced.run.id, replaced.replay), (error) => error.status === 409);
  for (let i=0;i<3;i++) await store.start(zero);
  await assert.rejects(store.start(zero), (error) => error.status === 429);
  const audit = (await db.query("select score, ticks, flaps from public.game_runs where id=$1", [improved.run.id])).rows[0];
  assert.equal(audit.score, 4);
  assert.equal(audit.ticks, improved.replay.ticks);
  assert.deepEqual(audit.flaps, improved.replay.flaps);
  // Keep a separate player to avoid the start rate limit in the expiry check.
  const expiredPlayer = {id:"d".repeat(64),name:"Expired Test",email:"expired@example.test"};
  const expired = await play(expiredPlayer, 1);
  await db.query("update public.game_runs set created_at=clock_timestamp()-interval '26 minutes' where id=$1", [expired.run.id]);
  await assert.rejects(store.submit(expiredPlayer, expired.run.id, expired.replay), (error) => error.status === 422);
  console.log("PASS Supabase storage and PostgreSQL: private emails, RLS, SDK requests, atomic saves, ownership, best scores, ties, replay audit, expiry and rate limits");
} finally {
  await new Promise((resolve) => fixture.close(resolve));
  await db.close();
}
