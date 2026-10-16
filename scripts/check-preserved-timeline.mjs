import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";

// Preserve the Timeline users actually saw on the last successful production
// deployment. The newer main commits had failed deployment before publishing.
const baseline = JSON.parse(await readFile(new URL("./preserved-timeline.json", import.meta.url), "utf8"));
for (const [path, expected] of Object.entries(baseline.protected)) {
  let text = (await readFile(new URL("../" + path, import.meta.url), "utf8")).replace(/\r\n/g, "\n");
  if (path.endsWith("/(site)/timeline/page.tsx")) {
    text = text.replace('"@/app/components/EffectsInitializer"', '"../components/EffectsInitializer"')
      .replace('"@/app/styles/base.css"', '"../styles/base.css"')
      .replace('"@/app/styles/timeline.css"', '"../styles/timeline.css"');
  }
  assert.equal(createHash("sha256").update(text).digest("hex"), expected.sha256, `${path} must preserve main's Timeline version from ${baseline.main_baseline}`);
}
console.log("PASS preserved production Timeline: page, base styles, timeline stylesheet and reveal effects");
