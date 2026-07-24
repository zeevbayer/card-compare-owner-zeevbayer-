# Card Compare

An analytical, independent credit card comparison and intelligence platform, inspired in
structure by CardRight. This is a real product build, not a static content site — it runs on
Next.js and a real Postgres database so it can eventually support accounts, a crowdsourced
approval database, and a card-tracking app.

The editorial position: most people don't understand what they're signing up for. This is not a
deals site — no urgency language, no "editor's pick" placement, sort order never influenced by
affiliate status. See `src/app/how-we-make-money/page.tsx` (linked from the footer, not the main
nav) for the full policy.

## Stack

- **Next.js 16** (App Router) + TypeScript + React 19
- **Postgres** via [Drizzle ORM](https://orm.drizzle.team) — schema in `src/db/schema.ts`
- **Tailwind CSS v4**
- Deployable to Vercel; needs a real Postgres instance (Neon, Supabase, Railway, etc.) in production

## Local development

Requires a local Postgres server.

```sh
# one-time: create the dev database (adjust if you already have Postgres running differently)
createuser cardright --pwprompt --createdb   # password: cardright_dev, or edit .env to match
createdb cardright -O cardright

cp .env.example .env   # already points at the local db above by default

npm install
npm run db:push        # create tables from the schema
npm run db:seed        # load issuers, categories, benefits, the 15 seed cards, and 3 articles

npm run dev             # http://localhost:3000
npm run build            # production build
npm run typecheck
```

## Build phases

**Phase 1 — done, this build.** Public site on the new stack: card database, finder with
category/bank/tier/benefit-shaped filters, rich card detail pages (offer summary, overview,
rewards breakdown, credits, benefits, application tips), articles, offers page, disclosures moved
to the footer per feedback (not a main-nav item).

**Phase 2 — not built yet.** Accounts (sign up / sign in) and the crowdsourced Approval Database:
users submit approval/denial outcomes (score, limit, bureau, state), held in a moderation queue
before publishing, aggregated into per-card approval stats. Schema for this already exists
(`users`, `approvalSubmissions` tables) — the UI and moderation flow do not.

**Phase 3 — not built yet.** The card-tracking app: users add cards they own, get bonus/benefit
deadline reminders, notifications, and "which card should I use for this purchase" recommendations.
This needs its own account-gated section of the app plus a notification system (email first).

**Phase 4 — not started, separate effort.** Native iOS/Android apps. A responsive web app should
come well before native app store submission and review.

## Database schema

See `src/db/schema.ts`. Key tables:

- `issuers`, `rewardCategories`, `rewardsPrograms`, `benefits` — taxonomy tables
- `cards` — the core card record (rates, fees, welcome offer, overview, application tips)
- `cardRewardRates`, `cardBenefits`, `cardCredits` — per-card details, many-to-many where relevant
- `topics`, `articles`, `articleRelatedCards` — editorial content
- `users`, `approvalSubmissions` — phase 2 foundation, not yet wired to any UI

**Never guess a number.** Every rate/fee/bonus field on `cards` is nullable and should stay `null`
until verified directly against the issuer. A card with `lastVerified: null` is automatically
excluded from finder results and shows "terms not yet verified." This is enforced in
`src/lib/verification.ts` and `src/lib/finder.ts` — don't work around it.

## Adding or editing data

There's no admin UI yet (that's part of phase 2). For now, edit `src/db/seed.ts` and re-run
`npm run db:seed` against a fresh `npm run db:push`, or write one-off SQL/Drizzle queries directly
against the local database. A real admin CMS is on the roadmap once the card catalog grows past
what's comfortable to hand-edit.

## Compliance / editorial rules baked into the code

- `src/components/AdvertiserDisclosureBar.tsx` — persistent, dismissible, exact required
  disclosure language, reachable from every page's footer even after dismissal
  (`ReopenDisclosureButton.tsx`).
- `src/components/AffiliateDisclosureNotice.tsx` — shorter above-the-fold notice, included on
  every page that lists cards.
- All outbound card links use `rel="sponsored nofollow noopener"` when `affiliateUrl` is set, and
  plain `rel="noopener"` otherwise — see `CardResult.tsx`. Button styling and position logic are
  identical either way; there is no "featured" or "sponsored" placement mechanism, intentionally.
- `src/lib/verification.ts` — staleness rules (90-day "verify current terms" notice, null
  `lastVerified` excludes a card from finder results, 30-day/expiry offer hiding).

## What's not done yet

- No real card data — every seed card has `lastVerified: null` and blank rate/fee/bonus fields on
  purpose. The finder and offers pages will show few or no results until real, verified figures
  are added.
- No accounts, no Approval Database UI, no tracking app (see Build phases above).
- No admin CMS — data entry is via the seed script or direct DB access.
- `public/og-default.svg` is an SVG OpenGraph placeholder; swap for a PNG/JPG before launch for
  best compatibility with Facebook/LinkedIn link previews.
- `/privacy-policy`, `/terms`, and the contact email are placeholders needing real legal review.
- `NEXT_PUBLIC_SITE_URL` needs to be set to the real production domain (used by the sitemap, RSS
  feed, and OpenGraph/canonical URLs).
