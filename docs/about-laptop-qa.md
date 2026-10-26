# About stars and laptop layout

27 October 2026. Local branch `codex/about-laptop-layout`, based on the published About page at `29b7c17`. No push or deployment for this revision.

About had a 78% black background over the existing shared star canvas. Removed that mask without altering the original star component, its opacity or its animation. The page remains transparent on phones too.

The content now uses a 1120px maximum width, a narrower heading column, readable text measure and tighter desktop spacing. The three event steps share a full-width row on laptops and retain their vertical sequence below 900px. Copy, links, metadata and shared page components are unchanged.

Verification:

* Production build, lint and TypeScript passed.
* Existing smoke suite passed for all nine content pages, links, media, missing pages and game HTTP boundaries.
* Timeline preservation check passed. Contact, Timeline, homepage, navbar, original star sources and the About route itself have no source diff from `29b7c17`.
* All 91 stylesheet rules remain scoped to `.about-editorial`; diff whitespace check passed.
* Browser review: 1366 x 768 and 1280 x 720 laptop viewports. Three equal 352px step columns; no horizontal overflow. About has a transparent computed background and uses the one existing star canvas.
* At 1366px, the full document including the unchanged footer is 1905px tall, compared with 2065px before this revision.
* Phone review: 375 x 812 viewport, 367px document width, one 327.2px step column and readable 16px body text. No browser errors. Temporary viewport overrides were reset.

Evidence in the parent task's `outputs/`: `about-laptop-before.png`, `about-laptop-1280.png`, `about-laptop-steps.png`, `about-stars-phone.png`. Screenshots and these basic checks do not establish full assistive-technology compliance.
