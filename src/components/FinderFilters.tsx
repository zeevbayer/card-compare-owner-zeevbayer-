import type { FinderFilters as Filters } from '@/lib/finder';

interface Props {
  filters: Filters;
  issuers: { slug: string; name: string }[];
  categories: { slug: string; label: string }[];
  action?: string;
}

const TIERS = [
  { slug: 'excellent', label: 'Excellent' },
  { slug: 'good', label: 'Good' },
  { slug: 'fair', label: 'Fair' },
  { slug: 'building', label: 'Building' },
];

const sortOptions = [
  { value: '', label: 'Default' },
  { value: 'annual-fee', label: 'Annual fee' },
  { value: 'intro-apr-length', label: 'Intro APR length' },
  { value: 'welcome-offer', label: 'Welcome offer value' },
];

const feeOptions = [
  { value: '', label: 'Any annual fee' },
  { value: '0', label: '$0 only' },
  { value: '95', label: 'Up to $95' },
  { value: '250', label: 'Up to $250' },
];

export default function FinderFilters({ filters, issuers, categories, action = '/finder' }: Props) {
  const tierSet = new Set(filters.tier ?? []);
  const issuerSet = new Set(filters.issuer ?? []);

  return (
    <form
      method="get"
      action={action}
      className="space-y-5 rounded-lg border border-charcoal-300/60 bg-white p-5"
    >
      <div>
        <label htmlFor="category" className="text-xs font-medium uppercase tracking-wide text-charcoal-500">
          Category
        </label>
        <select
          id="category"
          name="category"
          defaultValue={filters.category ?? ''}
          className="mt-1 w-full rounded border border-charcoal-300 bg-white px-3 py-2 text-sm"
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="feeMax" className="text-xs font-medium uppercase tracking-wide text-charcoal-500">
          Annual fee
        </label>
        <select
          id="feeMax"
          name="feeMax"
          defaultValue={filters.feeMax !== undefined ? String(filters.feeMax) : ''}
          className="mt-1 w-full rounded border border-charcoal-300 bg-white px-3 py-2 text-sm"
        >
          {feeOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <fieldset>
        <legend className="text-xs font-medium uppercase tracking-wide text-charcoal-500">
          Credit score tier
        </legend>
        <div className="mt-2 flex flex-wrap gap-3 text-sm">
          {TIERS.map((t) => (
            <label key={t.slug} className="flex items-center gap-1.5">
              <input type="checkbox" name="tier" value={t.slug} defaultChecked={tierSet.has(t.slug)} />
              {t.label}
            </label>
          ))}
        </div>
      </fieldset>

      {issuers.length > 0 && (
        <fieldset>
          <legend className="text-xs font-medium uppercase tracking-wide text-charcoal-500">Bank</legend>
          <div className="mt-2 flex flex-wrap gap-3 text-sm">
            {issuers.map((i) => (
              <label key={i.slug} className="flex items-center gap-1.5">
                <input type="checkbox" name="issuer" value={i.slug} defaultChecked={issuerSet.has(i.slug)} />
                {i.name}
              </label>
            ))}
          </div>
        </fieldset>
      )}

      <label className="flex items-center gap-1.5 text-sm">
        <input type="checkbox" name="introApr" value="true" defaultChecked={filters.introApr === true} />
        Has intro APR offer
      </label>

      <div className="flex gap-3">
        <div className="flex-1">
          <label htmlFor="sort" className="text-xs font-medium uppercase tracking-wide text-charcoal-500">
            Sort by
          </label>
          <select
            id="sort"
            name="sort"
            defaultValue={filters.sort ?? ''}
            className="mt-1 w-full rounded border border-charcoal-300 bg-white px-3 py-2 text-sm"
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex-1">
          <label htmlFor="dir" className="text-xs font-medium uppercase tracking-wide text-charcoal-500">
            Direction
          </label>
          <select
            id="dir"
            name="dir"
            defaultValue={filters.dir ?? 'asc'}
            className="mt-1 w-full rounded border border-charcoal-300 bg-white px-3 py-2 text-sm"
          >
            <option value="asc">Low to high</option>
            <option value="desc">High to low</option>
          </select>
        </div>
      </div>

      <button
        type="submit"
        className="w-full rounded bg-navy-900 px-4 py-2 text-sm font-medium text-paper hover:bg-navy-800"
      >
        Apply filters
      </button>
    </form>
  );
}
