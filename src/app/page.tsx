import Link from 'next/link';
import { getAllArticles, getCategoryCounts, getVerifiedCardCount } from '@/lib/queries';
import { PRESETS } from '@/lib/finder';
import { formatDate } from '@/lib/format';

export default async function HomePage() {
  const [articles, counts, verifiedCount] = await Promise.all([
    getAllArticles(),
    getCategoryCounts(),
    getVerifiedCardCount(),
  ]);
  const latestArticles = articles.slice(0, 3);

  return (
    <>
      <section className="border-b border-charcoal-300/60 bg-paper-dim">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6">
          <h1 className="font-serif-heading text-4xl font-semibold text-navy-900 sm:text-5xl">
            Read the terms before the card reads you.
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-charcoal-700">
            An analytical, independent read on credit card terms. Most comparison sites are built
            to sell you a card. We start from the assumption that most people don&apos;t
            understand what they&apos;re signing up for — and try to fix that, one card at a time.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/finder"
              className="rounded bg-navy-900 px-5 py-3 text-sm font-medium text-paper hover:bg-navy-800"
            >
              Find My Next Card
            </Link>
            <Link
              href="/articles"
              className="rounded border border-navy-900 px-5 py-3 text-sm font-medium text-navy-900 hover:bg-navy-900 hover:text-paper"
            >
              Explore Topics
            </Link>
          </div>
          <p className="mt-4 text-xs text-charcoal-500">
            {verifiedCount} card{verifiedCount === 1 ? '' : 's'} with verified terms on file
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <h2 className="font-serif-heading text-2xl font-semibold text-navy-900">
          Find a card by what matters to you
        </h2>
        <p className="mt-2 max-w-2xl text-charcoal-700">
          Every category links straight to filtered, verified results — no login required.
        </p>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          <Link
            href="/finder"
            className="block rounded-lg border border-charcoal-300/60 bg-white p-5 transition-colors hover:border-amber-600"
          >
            <p className="font-serif-heading text-base font-semibold text-navy-900">All Cards</p>
            <p className="mt-1 text-xs text-charcoal-500">{verifiedCount} cards</p>
          </Link>
          {PRESETS.map((preset) => {
            const count = preset.filters.category ? counts[preset.filters.category] ?? 0 : null;
            return (
              <Link
                key={preset.slug}
                href={`/finder/${preset.slug}`}
                className="block rounded-lg border border-charcoal-300/60 bg-white p-5 transition-colors hover:border-amber-600"
              >
                <p className="font-serif-heading text-base font-semibold text-navy-900">
                  {preset.shortLabel}
                </p>
                {count !== null && <p className="mt-1 text-xs text-charcoal-500">{count} cards</p>}
              </Link>
            );
          })}
        </div>
      </section>

      <section className="border-t border-charcoal-300/60 bg-paper-dim">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <div className="flex items-baseline justify-between">
            <h2 className="font-serif-heading text-2xl font-semibold text-navy-900">Latest articles</h2>
            <Link href="/articles" className="text-sm text-amber-700 underline hover:text-amber-600">
              View all
            </Link>
          </div>
          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
            {latestArticles.map((article) => (
              <article key={article.slug} className="rounded-lg border border-charcoal-300/60 bg-white p-5">
                <p className="text-xs uppercase tracking-wide text-charcoal-500">
                  {article.topic.label} · {formatDate(article.publishDate)}
                </p>
                <h3 className="font-serif-heading mt-1 text-lg font-semibold text-navy-900">
                  <Link href={`/articles/${article.slug}`} className="hover:text-amber-700">
                    {article.title}
                  </Link>
                </h3>
                <p className="mt-2 text-sm text-charcoal-700">{article.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
