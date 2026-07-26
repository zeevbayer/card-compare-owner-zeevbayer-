import Link from 'next/link';
import { getAllArticles, getPresetCounts, getHeadlineFigures } from '@/lib/queries';
import { PRESET_GROUPS, getPreset } from '@/lib/finder';
import { formatDate, formatApr } from '@/lib/format';

export const revalidate = 300;

export default async function HomePage() {
  const [articles, counts, figures] = await Promise.all([
    getAllArticles(),
    getPresetCounts(),
    getHeadlineFigures(),
  ]);
  const latestArticles = articles.slice(0, 3);

  return (
    <>
      {/* Hero — states the thesis, then immediately backs it with the verification record. */}
      <section className="bg-navy-950 text-paper">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20">
          <p className="text-xs uppercase tracking-[0.18em] text-amber-500">
            Independent · Nothing ranked by commission
          </p>
          <h1 className="font-serif-heading mt-4 max-w-3xl text-4xl font-semibold leading-[1.1] text-paper text-balance sm:text-5xl">
            Read the terms before the card reads you.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-charcoal-300">
            Most comparison sites are built to sell you a card. We check every rate and fee
            against the issuer&apos;s own page, publish the date we checked it, and leave a field
            blank rather than guess at it.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/finder"
              className="rounded bg-amber-600 px-5 py-3 text-sm font-medium text-navy-950 transition-colors hover:bg-amber-500"
            >
              Find a card
            </Link>
            <Link
              href="/approvals"
              className="rounded border border-charcoal-500 px-5 py-3 text-sm font-medium text-paper transition-colors hover:border-amber-500 hover:text-amber-500"
            >
              See real approval reports
            </Link>
          </div>

          {/* The verification record, stated as fact rather than claimed as a virtue. */}
          <dl className="mt-12 grid grid-cols-2 gap-x-8 gap-y-6 border-t border-navy-700 pt-8 sm:grid-cols-4">
            <div>
              <dt className="text-xs uppercase tracking-wide text-charcoal-500">Cards tracked</dt>
              <dd className="font-serif-heading mt-1 text-2xl font-semibold tabular-nums text-paper">
                {figures.totalVerified}
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-charcoal-500">Live signup offers</dt>
              <dd className="font-serif-heading mt-1 text-2xl font-semibold tabular-nums text-paper">
                {figures.offersCount}
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-charcoal-500">$0 fee + rewards</dt>
              <dd className="font-serif-heading mt-1 text-2xl font-semibold tabular-nums text-paper">
                {figures.noFeeRewardsCount}
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-charcoal-500">Last verified</dt>
              <dd className="font-serif-heading mt-1 text-2xl font-semibold text-paper">
                {figures.lastVerified ? formatDate(figures.lastVerified) : '—'}
              </dd>
            </div>
          </dl>
        </div>
      </section>

      {/* The actual numbers, up front. Each is a deterministic sort on verified data. */}
      <section className="border-b border-charcoal-300/60">
        <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
          <h2 className="font-serif-heading text-2xl font-semibold text-navy-900">
            What the verified data says right now
          </h2>
          <p className="mt-2 max-w-2xl text-charcoal-700">
            Not picks. These are simply whichever card currently wins on each measurable field,
            sorted from the figures we last confirmed with the issuer.
          </p>

          <div className="mt-8 grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-charcoal-300/60 bg-charcoal-300/60 sm:grid-cols-2">
            {figures.lowestApr && (
              <article className="bg-white p-6">
                <p className="text-xs uppercase tracking-wide text-charcoal-500">
                  Lowest ongoing purchase APR
                </p>
                <p className="font-serif-heading mt-2 text-3xl font-semibold tabular-nums text-navy-900">
                  {formatApr(figures.lowestApr.purchaseAprMin, figures.lowestApr.purchaseAprMax)}
                </p>
                <Link
                  href={`/cards/${figures.lowestApr.slug}`}
                  className="mt-2 inline-block text-sm text-amber-700 underline hover:text-amber-600"
                >
                  {figures.lowestApr.name}
                </Link>
                <p className="mt-1 text-xs text-charcoal-500">
                  {figures.lowestApr.issuer.name} · rate varies by creditworthiness
                </p>
              </article>
            )}

            {figures.longestIntro && (
              <article className="bg-white p-6">
                <p className="text-xs uppercase tracking-wide text-charcoal-500">
                  Longest 0% intro period
                </p>
                <p className="font-serif-heading mt-2 text-3xl font-semibold tabular-nums text-navy-900">
                  {figures.longestIntro.introAprMonths} months
                </p>
                <Link
                  href={`/cards/${figures.longestIntro.slug}`}
                  className="mt-2 inline-block text-sm text-amber-700 underline hover:text-amber-600"
                >
                  {figures.longestIntro.name}
                </Link>
                <p className="mt-1 text-xs text-charcoal-500">
                  {figures.longestIntro.issuer.name} ·{' '}
                  {figures.longestIntro.isDeferredInterest
                    ? 'deferred interest — read the terms'
                    : 'true intro APR, not deferred interest'}
                </p>
              </article>
            )}
          </div>

          <p className="mt-4 text-sm">
            <Link href="/finder" className="text-amber-700 underline hover:text-amber-600">
              Compare all {figures.totalVerified} cards →
            </Link>
          </p>
        </div>
      </section>

      {/* Categories as an index, grouped by the question the reader is actually asking. */}
      <section className="border-b border-charcoal-300/60 bg-paper-dim">
        <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
          <h2 className="font-serif-heading text-2xl font-semibold text-navy-900">
            Start from what you need
          </h2>

          {/* Columns rather than a grid: groups have uneven lengths, and a grid leaves an
              orphan row with a hole in it. */}
          <div className="mt-8 gap-x-12 sm:columns-2 lg:columns-3">
            {PRESET_GROUPS.map((group) => {
              const items = group.slugs
                .map((slug) => {
                  const preset = getPreset(slug);
                  if (!preset) return null;
                  return { preset, count: counts[preset.slug] ?? 0 };
                })
                .filter((x): x is { preset: NonNullable<ReturnType<typeof getPreset>>; count: number } => x !== null)
                // A category with nothing in it is not a browsing option — it's a dead end.
                .filter((x) => x.count > 0);

              if (items.length === 0) return null;

              return (
                <div key={group.heading} className="mb-8 break-inside-avoid">
                  <h3 className="border-b border-charcoal-300 pb-2 text-xs font-medium uppercase tracking-wide text-charcoal-500">
                    {group.heading}
                  </h3>
                  <ul className="mt-3 space-y-2">
                    {items.map(({ preset, count }) => (
                      <li key={preset.slug}>
                        <Link
                          href={`/finder/${preset.slug}`}
                          className="group flex items-baseline justify-between gap-3 text-charcoal-900 hover:text-amber-700"
                        >
                          <span className="underline decoration-charcoal-300 underline-offset-4 group-hover:decoration-amber-600">
                            {preset.shortLabel}
                          </span>
                          <span className="shrink-0 text-xs tabular-nums text-charcoal-500">
                            {count}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Articles as a reading list, not three boxes. */}
      <section className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="font-serif-heading text-2xl font-semibold text-navy-900">
            How this actually works
          </h2>
          <Link href="/articles" className="shrink-0 text-sm text-amber-700 underline hover:text-amber-600">
            All articles
          </Link>
        </div>

        <ul className="mt-6 divide-y divide-charcoal-300/60 border-t border-charcoal-300/60">
          {latestArticles.map((article) => (
            <li key={article.slug} className="py-5">
              <Link href={`/articles/${article.slug}`} className="group block">
                <p className="text-xs uppercase tracking-wide text-charcoal-500">
                  {article.topic.label} · {formatDate(article.publishDate)}
                </p>
                <h3 className="font-serif-heading mt-1 text-xl font-semibold text-navy-900 group-hover:text-amber-700">
                  {article.title}
                </h3>
                <p className="mt-1.5 max-w-3xl text-charcoal-700">{article.description}</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
