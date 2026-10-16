# NASA Space Apps Challenge Lucknow

Local event website for the 2026 NASA Space Apps Challenge, built with Next.js App Router, React and Tailwind CSS 3.

## Develop

Use Node.js 22 LTS or later and npm.

```sh
npm ci
npm run dev
```

Open http://localhost:3000.

## Verify a change

```sh
npm run lint
npm run build
npm run typecheck
npm test
```

`npm test` starts the production build on a temporary local port, checks all five public pages, registration redirects, metadata, navigation, contact destinations and hero media, then stops its server. Build before testing.

Also check desktop and phone layouts, the mobile menu including Escape, browser back/forward navigation, the hero pause control, reduced motion and content visibility without JavaScript.

## Update event details

Shared event information and destinations live in `src/lib/event.ts`. Update that file when dates, venue, registration, community or contact details change. The `/register` route redirects old shared links to the official Lucknow registration page.

The 2026 event is on 14 and 15 November at SR Group of Institutions, Sitapur Road, Bakshi Ka Talab, Lucknow. The venue and WhatsApp invitation were provided by the Lucknow organising committee. The organiser email and Instagram link are retained from the existing website.

Global dates, the six-person team limit and project submission guidance are based on https://www.spaceappschallenge.org/2026/. Challenge briefs are linked directly at https://www.spaceappschallenge.org/2026/challenges/. Do not add unconfirmed reporting times, award guarantees, challenge points or travel promises.

Contact uses direct email and WhatsApp links. There is no message storage or email delivery service configured.

## Deployment

The repository is associated with https://nsaclko.vercel.app. Build with `npm run build`. A pull request deployment can be used to review the changes before merging into the production branch.
