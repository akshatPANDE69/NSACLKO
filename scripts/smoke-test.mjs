import assert from "node:assert/strict";
import "./check-preserved-timeline.mjs";
import { spawn } from "node:child_process";
import { createServer } from "node:net";
import { once } from "node:events";
import { fileURLToPath } from "node:url";
import { setTimeout as delay } from "node:timers/promises";

// Exercise the built site over HTTP. No third-party services are contacted.
const root = fileURLToPath(new URL("../", import.meta.url));
const probe = createServer();
probe.listen(0, "127.0.0.1");
await once(probe, "listening");
const port = probe.address().port;
await new Promise((resolve) => probe.close(resolve));
const origin = `http://127.0.0.1:${port}`;
const child = spawn(process.execPath, ["node_modules/next/dist/bin/next", "start", "-H", "127.0.0.1", "-p", String(port)], { cwd: root, stdio: ["ignore", "pipe", "pipe"] });
let output = "";
child.stdout.on("data", (chunk) => { output += chunk; });
child.stderr.on("data", (chunk) => { output += chunk; });
const registration = "https://www.spaceappschallenge.org/2026/local-events/lucknow/";
const community = "https://chat.whatsapp.com/BEEGqEyXkg82LwfPSSjdpk";
const routes = ["/", "/about", "/team", "/challenges", "/timeline", "/contact"];

try {
  let ready = false;
  for (let attempt = 0; attempt < 120; attempt++) {
    if (child.exitCode !== null) throw new Error(`Production server exited: ${output}`);
    try { ready = (await fetch(origin, { signal: AbortSignal.timeout(1000) })).ok; } catch { /* Wait for startup. */ }
    if (ready) break;
    await delay(250);
  }
  assert.ok(ready, `Production server did not become ready: ${output}`);
  const pages = {};
  for (const route of routes) {
    const response = await fetch(origin + route);
    assert.equal(response.status, 200, `${route} must load`);
    const html = await response.text();
    const document = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, "");
    pages[route] = document;
    assert.equal((document.match(/<h1\b/g) || []).length, 1, `${route} must have one primary heading`);
    assert.match(document, /<main[^>]*id="main-content"/, `${route} must expose its main content`);
    assert.match(document, /<title>[^<]*2026/, `${route} must have edition-specific metadata`);
    assert.ok(document.includes(registration), `${route} must offer working official registration`);
    assert.ok(document.includes(community), `${route} must expose the community link`);
    assert.ok(document.includes("https://www.instagram.com/nsac_lko/"), `${route} must retain main's updated Instagram destination`);
    assert.doesNotMatch(document, /2025|AKGEC|My Next\.js App|NASA Headquarters|\d+ Points|undefined/, `${route} must not contain stale or placeholder information`);
    for (const [, href] of document.matchAll(/<a\b[^>]*href="([^"]+)"/g)) {
      assert.notEqual(href, "#", `${route} contains a dead placeholder link`);
      if (href.startsWith("/") && !href.startsWith("//")) {
        assert.ok([...routes, "/register"].includes(href.split(/[?#]/)[0]), `${route} points to an unknown local route: ${href}`);
      }
      if (href.startsWith("#")) {
        assert.ok(document.includes(`id="${href.slice(1)}"`), `${route} has an unresolved anchor: ${href}`);
      }
    }
    console.log(`PASS ${route}: content, metadata, headings and navigation`);
  }
  const hero = pages["/"].match(/<section[^>]*id="home"[^>]*>([\s\S]*?)<\/section>/)?.[1];
  assert.ok(hero?.includes(community), "WhatsApp community must be accessible from the hero");
  assert.match(hero, /poster="\/earth-poster\.jpg"/, "The original Earth background must have a static fallback");
  const poster = await fetch(origin + "/earth-poster.jpg");
  assert.equal(poster.status, 200);
  assert.match(poster.headers.get("content-type"), /image\/jpeg/);
  await poster.arrayBuffer();
  assert.match(pages["/contact"], /mailto:spaceappschallenge\.lko@gmail\.com/);
  assert.match(pages["/contact"], /Prepare Email/, "Contact form must explain its email-draft workflow");
  assert.match(pages["/challenges"], /https:\/\/www\.spaceappschallenge\.org\/2026\/challenges\//);
  assert.match(pages["/timeline"], /11:59 PM local time/i);
  assert.match(pages["/timeline"], /id="navbar"/, "Timeline must retain the navigation from the last successful production deployment");
  assert.match(pages["/timeline"], />Event Timeline<\/h1>/);
  assert.equal((pages["/timeline"].match(/class="timeline-item fade-in"/g) || []).length, 4, "Timeline must retain its four original milestones");
  assert.doesNotMatch(pages["/timeline"], /igloo-nav|MISSION ROADMAP|IBM Plex Mono/, "The failed deployment's alternate Timeline must not replace the live design");
  assert.doesNotMatch(pages["/contact"], /Our Team|Team Lead|Technical Lead|Development Lead|Content Lead|Marketing Lead/);
  for (const portrait of ["ansh.jpeg", "areeb.jpeg", "ayan.jpeg", "Jatinbhaiya.jpeg", "Kashni.jpeg", "saksham.jpeg", "Yash.jpeg", "pinkiebhaiya.jpeg", "shr.jpeg", "simba.jpeg", "pfpwa.jpg"]) {
    assert.equal((await fetch(origin + "/" + portrait)).status, 404, `${portrait} must no longer be served`);
  }
  console.log("PASS former team section and portrait removal");
  const redirect = await fetch(origin + "/register", { redirect: "manual" });
  assert.ok([307, 308].includes(redirect.status), "Previously shared registration URL must redirect");
  assert.equal(redirect.headers.get("location"), registration);
  console.log("PASS registration redirect and real contact/challenge destinations");
  const video = await fetch(origin + "/your-earth-video.mp4", { headers: { Range: "bytes=0-1023" } });
  assert.equal(video.status, 206, "Hero video must support playback/range requests");
  assert.match(video.headers.get("content-type"), /video\/mp4/);
  await video.arrayBuffer();
  const missing = await fetch(origin + "/this-page-does-not-exist");
  assert.equal(missing.status, 404);
  console.log("PASS hero media and missing-page handling");
} catch (error) {
  console.error(error);
  process.exitCode = 1;
} finally {
  child.kill();
  await Promise.race([once(child, "exit"), delay(5000)]);
}
