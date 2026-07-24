import type { Metadata } from 'next';
import CardResult from '@/components/CardResult';
import FinderFilters from '@/components/FinderFilters';
import AffiliateDisclosureNotice from '@/components/AffiliateDisclosureNotice';
import { getEligibleCards, getIssuers, getRewardCategories } from '@/lib/queries';
import { filterCards, sortCards, parseFinderParams, searchParamsToURLSearchParams } from '@/lib/finder';

export const metadata: Metadata = {
  title: 'Credit Card Finder',
  description:
    'Filter and compare credit cards by annual fee, credit score tier, category, and intro APR. Every filter combination produces a shareable link.',
};

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function FinderPage({ searchParams }: PageProps) {
  const rawParams = await searchParams;
  const filters = parseFinderParams(searchParamsToURLSearchParams(rawParams));

  const [allCards, issuers, categories] = await Promise.all([
    getEligibleCards(),
    getIssuers(),
    getRewardCategories(),
  ]);

  const filtered = sortCards(filterCards(allCards, filters), filters.sort, filters.dir);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="font-serif-heading text-3xl font-semibold text-navy-900">Credit Card Finder</h1>
      <p className="mt-2 max-w-2xl text-charcoal-700">
        Filter by category, annual fee, credit score tier, bank, and intro APR. Every filter
        combination has its own link, so you can bookmark or share exactly what you filtered for.
        Cards with no verified terms on file are excluded until we confirm them.
      </p>

      <div className="mt-6">
        <AffiliateDisclosureNotice />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[280px_1fr]">
        <aside>
          <FinderFilters
            filters={filters}
            issuers={issuers.map((i) => ({ slug: i.slug, name: i.name }))}
            categories={categories.map((c) => ({ slug: c.slug, label: c.label }))}
          />
        </aside>

        <div>
          <p className="mb-4 text-sm text-charcoal-500">
            {filtered.length} card{filtered.length === 1 ? '' : 's'}
          </p>

          {filtered.length === 0 ? (
            <p className="text-charcoal-600">
              No cards match those filters. Try widening your search, or check back once more
              cards have verified terms on file.
            </p>
          ) : (
            <div className="space-y-4">
              {filtered.map((card) => (
                <CardResult key={card.id} card={card} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
