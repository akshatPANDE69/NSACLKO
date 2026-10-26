# About editorial implementation plan

Goal: bring About into the approved Contact page's visual language, locally.

Architecture: a static Next.js server page using existing event constants, Next links and Lucide arrows. All new CSS is scoped to `.about-editorial`.

Spec: `docs/superpowers/specs/2026-10-26-about-design.md`.

Constraints: edit only the About route and its stylesheet; keep shared elements and Timeline intact; add no dependencies; do not push.

## Task 1: Page structure and presentation

- [x] Replace `src/app/(site)/about/page.tsx` with the compact introduction, event facts, participation explanation, three ordered process steps and registration/contact links. Add About-specific metadata and remove counter/card imports.
- [x] Replace `src/app/styles/about.css` with scoped type, layout, link and responsive rules matching Contact. No generic heading or paragraph selectors.
- [x] Build with `npm run build`, then run `node scripts/smoke-test.mjs`. Both exited successfully.
- [x] Inspect desktop, phone and landscape layout, actual navigation and console. No horizontal overflow, clear focus and no shared-source diff.
- [x] Record verification, commit locally and open `/about` for review. No push.
