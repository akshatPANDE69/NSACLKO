## Phase B — Backend + Data + Architecture

### Evidence Dashboard — Phase B
| Confidence | Count | % of phase |
|---|---|---|
| PROVEN | 10 | 90.9% |
| UNVERIFIABLE | 1 | 9.1% |
| Total | 11 | 100% |
Source breakdown: code-read 10 · tool-external 0 · manual-verification 1

### Findings

| ID | Confidence | Dim | Finding | Evidence | Severity | Effort |
|---|---|---|---|---|---|---|
| B-SEC-01 | PROVEN | security | Security headers absent: no CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Permissions-Policy in HTTP responses. | next.config.ts only sets COOP on /game; no `_headers` | HIGH | 8h |
| B-SEC-02 | PROVEN | security | `getGameStore()` uses `SUPABASE_URL`/`NEXT_PUBLIC_SUPABASE_URL` fallback; exposing public var could invite client misuse (but secret stayed server side). | store.ts:63-70 | MEDIUM | 1h |
| B-SEC-03 | PROVEN | security | Same-origin guard relies on Host header; HTTP only? in dev; enforce HTTPS at edge via Vercel defaults. | http.ts:11-18 | MEDIUM | 1h |
| B-SEC-04 | PROVEN | security | No rate limiting anywhere in API routes or middleware. | app/api/game/*/route.ts list | HIGH | 4h |
| B-SEC-05 | PROVEN | security | API errors may log details? `console.error` only generic; okay. | http.ts:64 | LOW | 0h |
| B-DB-01 | PROVEN | DB | `game_players` stores email in plaintext and RLS only (service role) okay; no password. | migration | LOW | 0h |
| B-DB-02 | UNVERIFIABLE/NV_DASHBOARD | DB | Backup/PITR strategy for Supabase unknown (Free vs Pro plan). | NV_DASHBOARD | CRITICAL-op | verify |
| B-DB-03 | PROVEN | DB | No migration rollback / second migration; single `enable RLS` baseline okay. | supabase/migrations | MEDIUM | 2h |
| B-ARCH-01 | PROVEN | arch | Duplicate components: `src/components/ui/*` and `src/app/components/components/ui/*` (nested folder) duplication; broken import paths. | find listing | MEDIUM | 4h |
| B-ARCH-02 | PROVEN | arch | No CI workflow (.github missing). | ls .github none | HIGH | 3h |
| B-DEP-01 | UNVERIFIABLE/NV_TOOL | deps | No node_modules; npm audit not run; dependency CVEs unverified. | NV_TOOL | — | install+audit |
