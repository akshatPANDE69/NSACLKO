## Phase A — Product surface

### Evidence Dashboard — Phase A
| Confidence | Count | % of phase |
|---|---|---|
| PROVEN | 7 | 87.5% |
| UNVERIFIABLE | 1 | 12.5% |
| Total | 8 | 100% |
Source breakdown: code-read 7 · tool-external 0 · manual-verification 1

### Findings

| ID | Confidence | Dim | Finding | Evidence | Severity | Effort |
|---|---|---|---|---|---|---|
| A-A11Y-01 | PROVEN | a11y | Secondary prose `text-gray-400` on dark gradients needs contrast check. | contact/page.tsx:26 | MEDIUM | 3h |
| A-A11Y-02 | PROVEN | a11y | Skip link present and main id. | layout.tsx:30-32 | LOW | 0h |
| A-A11Y-03 | PROVEN | a11y | SiteBackground autoplay video no reduced-motion guard. | components/SiteBackground.tsx | LOW | 2h |
| A-A11Y-04 | PROVEN | perf | Large autoplay videos in /public: culture.mp4 (~13MB), your-earth-video.mp4 (~14MB). | public/ | HIGH | 6h |
| A-SEO-01 | PROVEN | SEO | No robots.txt/sitemap.xml. | public/ | MEDIUM | 2h |
| A-SEO-02 | PROVEN | SEO | Missing OG/Twitter/canonical tags. | app/(site)/layout.tsx:10-15 | MEDIUM | 2h |
| A-SEO-03 | PROVEN | SEO | Canonical link absent. | app/(site)/(page) | LOW | 1h |
| A-PERF-01 | UNVERIFIABLE/NV_RUNTIME | perf | Core Web Vitals unknown. | NV_RUNTIME | - | -
