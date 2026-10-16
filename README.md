This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## 2026 event maintenance

Shared event details and official destinations live in `src/lib/event.ts`. This edition takes place on 14 and 15 November at SRGI, Sitapur Road, Bakshi Ka Talab, Lucknow.

Validate changes with `npm run build`, `npm run typecheck` and `npm test`. The HTTP regression checks start and stop a production server on a temporary port.

The contact form prepares an email draft for the participant to send from their email app. No email delivery backend is configured. Challenge cards illustrate project areas; official competition briefs are linked on the NASA Space Apps website.

## Preserved Timeline

Timeline matches commit `dd3917ef989ff61cfc147a6a144591710ec99d11`, the last successful production deployment before the page updates. Later main commits `39a28ab` and `93c6515` failed deployment, so their alternate Timeline was never the live version. Timeline uses the `(site)` layout again with its original black background, Arial typography, alternating milestones, navigation and footer. Its URL remains `/timeline`.

`scripts/check-preserved-timeline.mjs` verifies the preserved files against their source hashes before the HTTP checks. Update this baseline only when a Timeline change has been explicitly requested. The former team roster and portrait assets have been removed.
