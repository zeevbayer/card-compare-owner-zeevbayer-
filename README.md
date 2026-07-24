# Card Compare

An analytical, independent credit card comparison and review site. Astro + TypeScript +
Tailwind, static output, no database, no CMS, no accounts.

The editorial position: most people don't understand what they're signing up for. This is not a
deals site — no urgency language, no "editor's pick" placement, no ranking influenced by
affiliate status. See `src/pages/how-we-make-money.astro` for the full policy, enforced in code
by `src/lib/finder.ts` (sort order never touches affiliate status).

## Stack

- [Astro](https://astro.build) (static output) + TypeScript + Tailwind CSS v4
- Content lives in Markdown under `src/content/`, typed with Zod schemas in
  `src/content.config.ts`
- Deployable to Netlify or Vercel as a static site — no server runtime required

## Getting started

```sh
npm install
npm run dev       # http://localhost:4321
npm run build     # type-checks (astro check) then builds to dist/
npm run preview   # serve the production build locally
```

Before deploying, update `SITE_URL` in `astro.config.mjs` to your real domain — it drives the
sitemap, RSS feed, and canonical/OpenGraph URLs.

## Adding a new card

1. Create a new file in `src/content/cards/`, named after the card's slug, e.g.
   `src/content/cards/chase-freedom-flex.md`.
2. Fill in the frontmatter matching the schema in `src/content.config.ts`. Every numeric field
   (`annualFee`, `purchaseAprMin`/`Max`, `introApr`, `introAprMonths`, `balanceTransferFee`,
   `foreignTransactionFee`, `signupBonusSpend`) accepts `null` — **leave a field `null` rather
   than guessing.** A wrong number is worse than a missing one; the entire premise of this site
   is that the numbers are correct.
3. Set `lastVerified` to the date (`YYYY-MM-DD`) you confirmed the terms directly against the
   issuer's own page. Leave it `null` until you've done that — cards with `lastVerified: null`
   are automatically excluded from finder results and show "terms not yet verified."
4. If the card has a live signup bonus you want listed on `/offers`, also set `offerVerified`
   (date you confirmed the bonus) and, if it has a deadline, `expiresOn`. Offers auto-hide once
   `offerVerified` is more than 30 days old or `expiresOn` has passed — no manual cleanup needed.
5. `categories` is a plain array of strings. The finder's built-in category filter currently
   recognizes: `cash-back`, `groceries`, `gas`, `travel`, `balance-transfer`, `secured` (see
   `src/lib/categories.ts`). You can add more; uncatalogued categories just won't have a filter
   chip or preset page yet.
6. The card's `slug` field must match the filename (minus `.md`) — related-card lookups from
   articles depend on this.

The card automatically gets a detail page at `/cards/<slug>` and shows up in finder results (once
`lastVerified` is set) and on any preset page matching its `categories`/`creditScoreTier`.

## Adding a new article

1. Create a new file in `src/content/articles/`, e.g.
   `src/content/articles/how-balance-transfers-work.md`.
2. Fill in frontmatter: `title`, `description`, `publishDate`, `lastUpdated`, `category`, and
   optionally `relatedCards` (an array of card slugs — each renders as a full card block at the
   bottom of the article) and `youtubeId` (just the video ID, e.g. `dQw4w9WgXcQ`, to embed a
   video).
3. Write the body as normal Markdown below the frontmatter.
4. If you cite a specific number (an APR, a percentage, a dollar figure), mark it with
   `[VERIFY: source URL]` inline until you've confirmed it against a real source — see the three
   starter articles for the pattern. Don't publish a marked figure as final.

The article automatically appears on `/articles`, is filterable by its `category`, and gets its
own page at `/articles/<filename-without-extension>`.

## Adding a new finder preset

Presets live in `src/lib/finder.ts` as the `PRESETS` array — each entry has a `slug`, `title`,
`shortLabel` (used on the homepage tile), an `intro` paragraph, and a `filters` object using the
same filter shape as `/finder`'s query params. Adding an entry automatically creates a static page
at `/finder/<slug>` and a homepage tile.

## Compliance / editorial rules baked into the code

- `src/components/AdvertiserDisclosureBar.astro` — persistent, dismissible, exact required
  disclosure language, reachable from every page's footer even after dismissal.
- `src/components/AffiliateDisclosureNotice.astro` — shorter above-the-fold notice, included on
  every page that lists cards.
- All outbound card links use `rel="sponsored nofollow noopener"` when `affiliateUrl` is set, and
  plain `rel="noopener"` otherwise — see `CardResult.astro`. Button styling and position logic are
  identical either way; there is no "featured" or "sponsored" placement mechanism, intentionally.
- `src/lib/verification.ts` — the staleness rules (90-day "verify current terms" notice, null
  `lastVerified` excludes a card from finder results, 30-day/expiry offer hiding).

## What's not done yet

- No real card data — every seed card in `src/content/cards/` has `lastVerified: null` and blank
  numeric fields on purpose. The finder and offers pages will show few or no results until real,
  verified figures are filled in.
- `public/og-default.svg` is an SVG OpenGraph placeholder; some platforms (notably Facebook/
  LinkedIn) render OG images better as PNG/JPG — swap in a real one before launch.
- `/privacy-policy`, `/terms`, and the contact email are placeholders and need real legal review
  before this goes live.
- `SITE_URL` in `astro.config.mjs` is a placeholder domain.
