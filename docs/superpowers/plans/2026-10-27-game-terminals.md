# Game registration terminals

Goal: Remove the general Esports terminal. Opening a game shows that game's registration form inside the existing popup.

Keep the current cards, videos, rules, home link and private Supabase endpoint. Fix the title in each form. Show team and roster fields only for squad titles. Keep separate in-memory form state so closing, reopening or switching games cannot mix entries or discard pending receipts. Store no personal details in browser storage.

## Implementation

- [x] Add regression coverage for selected-game submission, independent pending forms and existing lost-response retry protection. Observed the old controller submitting FIFA instead of COD before implementation.
- [x] Replace the shared section with game-specific popup forms. Reuse the current styling with readable form surfaces, labelled fields, visible focus, responsive columns and status feedback.
- [x] Run the registration tests, production build and site smoke checks. Inspect desktop and phone flows in Edge without sending real registrations. Request a final code review.

Scope: public/gaming/index.html, public/gaming/app.js, public/gaming/style.css, scripts/tournament-browser-test.mjs and scripts/smoke-test.mjs. No database migration or other page changes.

## Verification

Production build, full npm test, lint, typecheck and JavaScript syntax checks passed. The full test suite also checks the preserved production Timeline.

Edge confirmed all six matching popup terminals, solo versus squad fields, FIFA draft retention across a COD switch, phone layout at 375 by 812, Escape closure and a real HTTP 400 validation response with retained inputs. The browser check deliberately used a blank alias and fictional contact details, so no tournament entry was created. Positive saves and lost-response retries were tested against the isolated test database, not production.

Fresh code review reported no critical or important findings. Its optional pending-request test improvement was applied by waiting until both requests actually reach fetch before releasing their responses, with a duplicate-submit check on the first pending form.
