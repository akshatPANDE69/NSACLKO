# Website functionality verification

27 October 2026. Baseline: published commit `6726e2f`. Scope: operational checks and verified fixes, with the existing website domain and design preserved.

## Findings and corrections

* Esports registration previously generated a random confirmation and saved nothing. It now posts to `/api/tournaments/registrations`, validates bounded inputs on the server and saves privately to the existing Supabase project before returning a reference. There is no claim of an automated email or guaranteed tournament place.
* Duplicate submissions after an interrupted response, including a reload, reuse the pending request identity. Session storage contains a random UUID indexed by a digest, without raw form details. Errors retain the form values and make retry available.
* Registration records use RLS and are inaccessible to public/anonymous or authenticated browser roles. Only the existing server credential can execute the registration RPC. Atomic per-connection rate checks and same-origin checks are included.
* The Esports internal navbar was removed at the user's request. Its Back to home link uses `target="_top"` to leave the iframe and return to the real homepage.
* Missing `/team/*.jpg` files caused four live image-optimizer errors. Member initials now render without missing image requests. All team email links use the existing verified public support address.
* The team spotlight's four-column mobile grid overflowed to 458px in a 375px viewport. It now reflows to two columns below 1200px and one below 760px; verified document width is 367px at a 375px viewport.
* Tournament cards now support keyboard activation. The rules dialog has correct visible/hidden semantics, focus cycling and focus restoration; selecting a title focuses the corresponding registration field.
* Signed-in practice players now see an accurate hint to switch to ranked play rather than being told to sign in again.

## Verification steps and health

1. **Live deployment and routes: passed.** GitHub reported the baseline Vercel deployment successful. All nine content routes plus `/gaming` and its iframe document returned 200. Page titles/headings and the iframe's own primary heading were checked. The initial live asset scan identified only the four missing team image requests described above.
2. **Build and automated checks: passed.** Production build includes lint and TypeScript. The full game authentication/replay/PostgreSQL tests and HTTP smoke suite passed. Added API/database and actual-browser-controller regression suites; both pass. Public JavaScript syntax and diff whitespace checks pass.
3. **Mobile main navigation: passed.** Open, Escape to close, reopen and navigate to Challenges were exercised at 375 x 812. Original shared navigation code and animation are unchanged.
4. **Challenge browsing: passed.** Fourteen cards initially; searching for health monitoring returns one; combining with Earth returns the explicit zero-results state; clearing and selecting All restores fourteen. No phone horizontal overflow.
5. **Team directory: passed after correction.** Committee filter returns eight members. Initials render without broken images. Verified the mobile grid correction visually and through document dimensions.
6. **Contact enquiries: passed.** Empty submit reports three inline errors and focuses Name. A school enquiry prepares a mailto draft to `nsac-lucknow-support@googlegroups.com`. No email was sent.
7. **Google and game: passed in live Edge.** Real Google account selection returned to an authenticated game and personal leaderboard row. A practice flight started and ended, with Play again available. No ranked flight or new leaderboard score was submitted.
8. **Esports UI: passed locally.** Removed navigation, iframe exit, title rules, focus cycle, game selection and required-field validation were exercised. Invalid server-side registration data returned a visible error rather than confirmation. The client/controller regression verifies input retention and interrupted-response retries.
9. **Existing Supabase: passed.** The user explicitly chose the existing project. Applied `202610270001_tournament_registrations.sql` there. A real insertion/receipt assertion ran in a transaction and rolled back. Final query returned zero retained test rows, RLS enabled, anonymous SELECT false and anonymous function execution false. The existing server credential can access the new table.

## Preservation and limits

The original Timeline preservation test passes. Homepage, About, Contact, shared navbar, original Earth/star sources and their styles have no source diff from the baseline. No new hosting service, paid plan, domain or environment variable is required.

Screenshots and HTTP records are in the parent task's `outputs/website-qa-2026-10-27/`: live HTTP scan, game, contact, team before/after, registration validation and database permissions. The database test left no fictitious registration behind. A complete positive HTTP registration was tested against real PostgreSQL through a local Supabase-compatible test server; production SQL insertion was separately verified and rolled back. No actual email delivery was attempted. Browser checks cover Edge and the recorded responsive viewport, not every browser or full assistive-technology compliance.

An independent code review found the reload/retry duplication case. It was reproduced, fixed and reviewed again with no remaining important findings. The report deliberately does not claim the entire website is guaranteed error-free.
