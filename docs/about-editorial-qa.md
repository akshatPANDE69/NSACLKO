# About page local verification

Branch: `codex/about-editorial`, based on `1c34af4`. Only the About route, its stylesheet and the accompanying local documentation changed. No push or deployment.

The page follows Contact's existing Arial, white/silver palette, two-column alignment, quiet stars and thin rules. It is a static server component. Removed the repeated mission cards and cumulative counters; retained event constants and official registration/community links. The new route's reported size is 180 B, with 106 kB first-load JavaScript. No new dependencies or assets.

Verification completed on 26 October 2026:

* `npm run build`: passed, including TypeScript and lint.
* `node scripts/smoke-test.mjs`: passed for all nine content pages, links, media, game HTTP boundaries and missing pages.
* `node scripts/check-preserved-timeline.mjs`: passed. Protected shared sources and Contact have no diff from `1c34af4`.
* PostCSS inspection: all 76 About rules include `.about-editorial`. `git diff --check`: passed.
* Browser: reviewed at 1528 x 732, 375 x 812 and 812 x 375 CSS pixels. Document widths were 1520, 367 and 804 respectively, without horizontal overflow.
* Phone registration button measures 327.2 x 46.6 CSS pixels. Keyboard focus reaches the community link with a visible outline. The school enquiry link navigates to `/contact` and back successfully.
* Browser error log: empty. Heading order and the ordered process list were inspected. The source includes reduced-motion transition handling; system reduced-motion emulation was not performed.

Evidence in the parent task's `outputs/`: `about-before.png`, `about-editorial-desktop.png`, `about-editorial-phone.png`. Temporary viewport overrides were reset. These basic browser checks do not establish full assistive-technology compliance.
