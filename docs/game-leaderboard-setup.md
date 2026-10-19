# Game leaderboard setup

The game uses Google Identity Services for sign in, Google's authentication library for server verification, and Supabase PostgreSQL for shared scores. Guest practice stays available until both account sign in and storage are connected.

## Personal email privacy

The owner's personal Google account can own the Cloud project and receive private developer notifications. Do not use the owner's personal email as the User Support Email, app contact address on the website, or public leaderboard field. Google makes the OAuth User Support Email visible to players.

Use an event address or a Google Group managed by the owner for that public support field. A group used as a support alias must restrict member lists and member email addresses to owners, restrict joining to invitations, and keep conversations private. Public senders can email the group while its owner's personal address remains hidden. Set replies to use the group address when responding as support.

The private developer contact field can use the owner's personal email. The Google sign in configuration must be checked to ensure the consent screen shows the support alias, rather than a personal address, before public launch.

References: [Google branding and support email](https://support.google.com/cloud/answer/15549049), [Google Group settings](https://support.google.com/groups/answer/2464926).

## Google client ID

1. Open [Google Auth Platform](https://console.cloud.google.com/auth/clients) with the account that should own this website's sign in. Create or select a project for NASA Space Apps Lucknow.
2. Configure the app branding and choose External as the audience. Use the public support alias described above. Use only basic sign in information: openid, email and profile.
3. Create an OAuth Web application client. Add `https://nsaclko.vercel.app`, `http://localhost`, `http://localhost:3000` and `http://127.0.0.1:3000` under Authorised JavaScript origins.
4. Add `https://nsaclko.vercel.app/api/game/google` under Authorised redirect URIs. Set `GOOGLE_CLIENT_ID` to the public client ID ending in `.apps.googleusercontent.com`. No Google client secret is needed. On HTTPS, the native Google button uses full page sign in and returns to this endpoint, then `/game`. HTTP local testing keeps the original popup callback. Browser managed FedCM remains disabled.

The setup uses Google project `nasa-space-apps-lucknow` and the public support address `nsac-lucknow-support@googlegroups.com`. The app remains in Google's testing mode. Basic Sign in with Google requests for name, email and profile are exempt from the testing user restriction, as explained in [Google's audience documentation](https://support.google.com/cloud/answer/15549945). Branding can use the deployed game and `/game/privacy` URLs. No additional OAuth scopes are requested.

## Supabase storage

1. Create or select the intended Supabase project. Run `supabase/migrations/202610180001_game_leaderboard.sql` once in that project's SQL Editor, or apply it with Supabase CLI migrations. It creates three private tables and three server only functions.
2. Set `SUPABASE_URL` and `SUPABASE_SECRET_KEY` in the existing Vercel project's server environment settings. Get the URL from the project's Connect panel and the secret key from Settings > API Keys. Never put the secret in a `NEXT_PUBLIC_` variable or commit it. The legacy `SUPABASE_SERVICE_ROLE_KEY` is supported too.
3. Add `GOOGLE_CLIENT_ID` in Vercel and redeploy. Locally, copy `.env.example` to `.env.local` and supply the same three values privately.

Google handles sign in directly and Supabase stores game data behind the server. This configuration does not use Supabase Auth or require its Google provider to be enabled. No Supabase client or privileged key is shipped to the browser.

The migration has been applied to Supabase project `nuvcafyhhfwudtkmieuu`. Its server connection and the Google client ID are configured in the ignored local `.env.local` file. The owner configured the three Production environment variables in the existing Vercel project. The site remains at `https://nsaclko.vercel.app`; its game APIs connect to Supabase and real ranked scores are saved. A separate optional Netlify project was prepared but has no website deployment and does not replace the original address.

## Player privacy

The server verifies Google's signature, audience, issuer, expiry, verified email and the browser nonce. A verified Google ID token is stored in a Secure, HttpOnly, SameSite cookie for at most its remaining lifetime, capped at one hour. Every authenticated game request verifies it again. Sign out clears that cookie.

Google's full page response is a bounded form POST. Its `g_csrf_token` field must match Google's browser cookie, and the signed identity token's nonce must match the app's anonymous HttpOnly nonce cookie. Missing, duplicate, mismatched and oversized fields are rejected. The anonymous nonce lasts five minutes and uses Secure and SameSite=None in production to reach the cross site callback. The authenticated session remains SameSite=Lax. Game tabs share the existing nonce so that opening a second tab does not invalidate a sign in already in progress.

Guest pages renew their nonce every minute while visible and when returning from a sleeping tab or browser history. Overlapping session requests share one promise. A stale button is paused while its sign in check is refreshed. Expired checks, missing callback cookies and database failures have distinct messages beside the account controls; sign in errors do not hide the public leaderboard.

A hash of Google's stable subject identifies each player. The `game_players` table contains the verified display name and private contact email. The public leaderboard returns only display name, score, rank and whether the row belongs to the current player. Emails, Google subjects, account IDs and flight controls are excluded from public responses.

All three game tables use RLS and revoke browser role permissions. Database functions are executable only by the service role. The Next.js server verifies each player and uses the Supabase secret key for database operations. Changing scores by calling Supabase directly from a browser is denied.

## Ranking and prize review

First place wins an unrevealed surprise prize. Participation is open to everyone, and the page publishes no closing date. The app does not automatically choose a final winner or pay a prize. Organisers review the winning flight before awarding it.

Each ranked flight gets a server issued ID and random seed tied to its player. The server computes the score by replaying input ticks through the shared simulation. Incomplete, impossible, excessively long or prematurely submitted flights are rejected. Practice scores cannot be uploaded later.

Flights last at most 20 minutes of simulation and allow five additional minutes for submission. One open flight is active per player. The database enforces six starts per minute and 180 per hour across server instances. Finalisation is atomic and safely repeatable. Only higher personal bests replace existing scores. Equal scores keep the order in which the database first recorded them, including when requests arrive concurrently.

Completed runs retain the seed, tick count and flap inputs for review. No replay or contact email is exposed by the public game API. Only the top 20 are shown publicly; authenticated players also receive their own best score and rank outside that range.

Valid replay checking prevents fabricated scores but cannot prove a human played the controls. Review leading replays for automation or abuse before confirming a winner. Moderation can be performed in the Supabase dashboard. There is no public moderation or deletion endpoint. Retain winning runs through prize review.

An organiser can inspect winning flights privately with:

```sql
select p.display_name, p.email, s.score, s.achieved_at, r.id as run_id,
       r.seed, r.ticks, r.flaps, r.created_at, r.submitted_at
from public.game_scores s
join public.game_players p using (player_id)
join public.game_runs r on r.id = s.run_id
order by s.score desc, s.achieved_order, s.player_id;
```

## Verification

Run `npm run build`, then `npm test`. Tests cover actual RSA signature verification with fixture certificates, token audience and issuer, expiry, browser nonce, cookie settings, request bounds and deterministic score validation. The Supabase JavaScript SDK is exercised against the actual migration in isolated PostgreSQL, including RLS, private email fields, duplicate saves, ownership, best scores, ties, replay audit, expiry and rate limits. These tests use only synthetic identities and no real external account.

Existing route tests and Timeline preservation checks remain in place. After configuring the real project, test the public Google consent screen, sign in and cancellation, a ranked flight, a second account's leaderboard view, sign out and retrying a flight after a connection failure.

References: [Google token verification](https://developers.google.com/identity/gsi/web/guides/verify-google-id-token), [Google button JavaScript API](https://developers.google.com/identity/gsi/web/reference/js-reference), [Supabase API keys](https://supabase.com/docs/guides/getting-started/api-keys), [Supabase RLS](https://supabase.com/docs/guides/database/postgres/row-level-security).
