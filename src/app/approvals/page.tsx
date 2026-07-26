import type { Metadata } from 'next';
import Link from 'next/link';
import { browseSubmissions, type ApprovalBrowseFilters } from '@/lib/approvals';
import { getIssuers } from '@/lib/queries';
import { formatDate } from '@/lib/format';

export const metadata: Metadata = {
  title: 'Approval Database',
  description:
    'Reader-submitted credit card approval and denial reports — credit score, limit granted, and which bureau was pulled. Self-reported and unverified.',
};

export const revalidate = 300;

const BUREAU_LABEL: Record<string, string> = {
  experian: 'Experian',
  transunion: 'TransUnion',
  equifax: 'Equifax',
};

const selectClass =
  'mt-1 w-full rounded border border-charcoal-300 bg-white px-3 py-2 text-sm text-charcoal-900';
const labelClass = 'text-xs font-medium uppercase tracking-wide text-charcoal-500';

interface PageProps {
  searchParams: Promise<Record<string, string | undefined>>;
}

export default async function ApprovalsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const filters: ApprovalBrowseFilters = {
    issuerSlug: params.issuer || undefined,
    bureau: params.bureau || undefined,
    state: params.state || undefined,
    sinceDays: params.since ? Number(params.since) : undefined,
    sort: (params.sort as ApprovalBrowseFilters['sort']) || 'recent',
  };

  const [rows, issuers] = await Promise.all([browseSubmissions(filters), getIssuers()]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <h1 className="font-serif-heading text-3xl font-semibold text-navy-900">Approval Database</h1>
      <p className="mt-2 max-w-2xl text-charcoal-700">
        Reports from readers who applied — approved and denied — including the credit score they
        applied with, the limit they were granted, and which credit bureau the issuer pulled.
      </p>

      <div className="mt-4 rounded border border-charcoal-300/60 bg-paper-dim px-4 py-3 text-sm text-charcoal-700">
        <strong className="text-charcoal-900">Read these carefully.</strong> Every figure here is
        self-reported and unverified. Scores are whatever the person believed theirs was. People
        who get approved are more likely to file a report than people who get denied, so the mix
        skews positive. Issuers change underwriting without notice and don&apos;t publish their
        criteria. Useful as a rough pattern; not a prediction of what will happen to you.
      </div>

      <form method="get" className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-4">
        <div>
          <label htmlFor="issuer" className={labelClass}>
            Bank
          </label>
          <select id="issuer" name="issuer" defaultValue={filters.issuerSlug ?? ''} className={selectClass}>
            <option value="">All banks</option>
            {issuers.map((i) => (
              <option key={i.slug} value={i.slug}>
                {i.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="bureau" className={labelClass}>
            Bureau
          </label>
          <select id="bureau" name="bureau" defaultValue={filters.bureau ?? ''} className={selectClass}>
            <option value="">Any</option>
            <option value="experian">Experian</option>
            <option value="transunion">TransUnion</option>
            <option value="equifax">Equifax</option>
          </select>
        </div>
        <div>
          <label htmlFor="since" className={labelClass}>
            Period
          </label>
          <select id="since" name="since" defaultValue={params.since ?? ''} className={selectClass}>
            <option value="">All time</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
            <option value="365">Last 12 months</option>
          </select>
        </div>
        <div>
          <label htmlFor="sort" className={labelClass}>
            Sort
          </label>
          <select id="sort" name="sort" defaultValue={filters.sort ?? 'recent'} className={selectClass}>
            <option value="recent">Most recent</option>
            <option value="score-asc">Score, low to high</option>
            <option value="score-desc">Score, high to low</option>
            <option value="limit-asc">Limit, low to high</option>
            <option value="limit-desc">Limit, high to low</option>
          </select>
        </div>
        <div className="sm:col-span-4">
          <button
            type="submit"
            className="rounded bg-navy-900 px-4 py-2 text-sm font-medium text-paper hover:bg-navy-800"
          >
            Apply filters
          </button>
        </div>
      </form>

      <p className="mt-8 text-sm text-charcoal-500">
        {rows.length} report{rows.length === 1 ? '' : 's'}
      </p>

      {rows.length === 0 ? (
        <p className="mt-4 text-charcoal-600">
          No reports match those filters yet. Reports come from readers — if you&apos;ve applied for
          a card recently, you can add yours from any{' '}
          <Link href="/finder" className="text-amber-700 underline">
            card page
          </Link>
          .
        </p>
      ) : (
        <ul className="mt-4 space-y-3">
          {rows.map((s) => (
            <li key={s.id} className="rounded-lg border border-charcoal-300/60 bg-white p-5">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <div>
                  <p className="text-xs uppercase tracking-wide text-charcoal-500">
                    {s.card.issuer.name}
                  </p>
                  <h2 className="font-serif-heading text-base font-semibold text-navy-900">
                    <Link href={`/cards/${s.card.slug}`} className="hover:text-amber-700">
                      {s.card.name}
                    </Link>
                  </h2>
                </div>
                <span
                  className={`rounded-full border px-3 py-1 text-xs font-medium ${
                    s.approved
                      ? 'border-navy-700 text-navy-900'
                      : 'border-charcoal-300 text-charcoal-600'
                  }`}
                >
                  {s.approved ? 'Approved' : 'Denied'}
                </span>
              </div>

              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-charcoal-700">
                {s.creditScore !== null && <span className="tabular-nums">Score {s.creditScore}</span>}
                {s.approved && s.creditLimit !== null && (
                  <span className="tabular-nums">
                    Limit ${Number(s.creditLimit).toLocaleString()}
                  </span>
                )}
                {s.bureau && <span>{BUREAU_LABEL[s.bureau] ?? s.bureau}</span>}
                {s.state && <span>{s.state}</span>}
                {s.creditHistoryYears !== null && (
                  <span className="tabular-nums">{Number(s.creditHistoryYears)} yr history</span>
                )}
              </div>

              {s.notes && <p className="mt-2 text-sm text-charcoal-700">{s.notes}</p>}

              <p className="mt-2 text-xs text-charcoal-500">
                {s.displayName || 'Anonymous'} · {formatDate(s.submittedAt)}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
