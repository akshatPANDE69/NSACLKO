import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";

// Main's Timeline is intentionally kept as its own complete visual experience.
// Update this baseline only when a Timeline change is explicitly authorised.
const baseline = JSON.parse(await readFile(new URL("./preserved-timeline.json", import.meta.url), "utf8"));
for (const [path, expected] of Object.entries(baseline.protected)) {
  let text = (await readFile(new URL("../" + path, import.meta.url), "utf8")).replace(/\r\n/g, "\n");
  if (path.endsWith("/(timeline)/layout.tsx")) text = text.replace('import "../globals.css";', 'import "./globals.css";');
  assert.equal(createHash("sha256").update(text).digest("hex"), expected.sha256, `${path} must preserve main's Timeline version from ${baseline.main_baseline}`);
}
console.log("PASS preserved main Timeline: page, theme, layout, stylesheet and dither background");
