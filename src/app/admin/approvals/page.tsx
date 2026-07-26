import type { Metadata } from 'next';
import { getPendingSubmissions } from '@/lib/approvals';
import { moderateApproval } from '@/app/actions/moderate-approval';
import { formatDate } from '@/lib/format';

export const metadata: Metadata = {
  title: 'Review submitted reports',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

interface PageProps {
  searchParams: Promise<{ token?: string }>;
}

const BUREAU_LABEL: Record<string, string> = {
  experian: 'Experian',
  transunion: 'TransUnion',
  equifax: 'Equifax',
};

export default async function AdminApprovalsPage({ searchParams }: PageProps) {
  const { token } = await searchParams;
  const expected = process.env.ADMIN_TOKEN;

  if (!expected) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
        <h1 className="font-serif-heading text-2xl font-semibold text-navy-900">
          Moderation not configured
        </h1>
        <p className="mt-3 text-charcoal-700">
          Set an <code className="rounded bg-paper-dim px-1">ADMIN_TOKEN</code> environment
          variable, then open this page with <code className="rounded bg-paper-dim px-1">?token=…</code>{' '}
          appended to the URL.
        </p>
      </div>
    );
  }

  if (token !== expected) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
        <h1 className="font-serif-heading text-2xl font-semibold text-navy-900">Not authorized</h1>
        <p className="mt-3 text-charcoal-700">
          Open this page with the correct <code className="rounded bg-paper-dim px-1">?token=…</code>{' '}
          in the URL.
        </p>
      </div>
    );
  }

  const pending = await getPendingSubmissions();

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="font-serif-heading text-2xl font-semibold text-navy-900">
        Reports awaiting review
      </h1>
      <p className="mt-2 text-sm text-charcoal-600">
        Nothing here is visible on the site until you publish it. Reject anything that looks like
        spam, an advertisement, or that contains personal details someone shouldn&apos;t have
        posted.
      </p>

      {pending.length === 0 ? (
        <p className="mt-8 text-charcoal-600">Nothing waiting. </p>
      ) : (
        <ul className="mt-8 space-y-4">
          {pending.map((s) => (
            <li key={s.id} className="rounded-lg border border-charcoal-300/60 bg-white p-5">
              <p className="text-xs uppercase tracking-wide text-charcoal-500">
                {s.card.issuer.name}
              </p>
              <h2 className="font-serif-heading text-lg font-semibold text-navy-900">
                {s.card.name}
              </h2>

              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm">
                <span className={s.approved ? 'font-medium text-navy-900' : 'font-medium text-charcoal-600'}>
                  {s.approved ? 'Approved' : 'Denied'}
                </span>
                {s.creditScore !== null && <span className="tabular-nums">Score {s.creditScore}</span>}
                {s.creditLimit !== null && (
                  <span className="tabular-nums">
                    Limit ${Number(s.creditLimit).toLocaleString()}
                  </span>
                )}
                {s.bureau && <span>{BUREAU_LABEL[s.bureau] ?? s.bureau}</span>}
                {s.state && <span>{s.state}</span>}
                {s.annualIncome !== null && (
                  <span className="tabular-nums">
                    Income ${Number(s.annualIncome).toLocaleString()}
                  </span>
                )}
                {s.creditHistoryYears !== null && (
                  <span className="tabular-nums">{Number(s.creditHistoryYears)} yr history</span>
                )}
              </div>

              {s.notes && <p className="mt-2 text-sm text-charcoal-700">{s.notes}</p>}

              <p className="mt-2 text-xs text-charcoal-500">
                {s.displayName || 'Anonymous'} · submitted {formatDate(s.submittedAt)}
              </p>

              <div className="mt-4 flex gap-3">
                <form action={moderateApproval}>
                  <input type="hidden" name="token" value={token} />
                  <input type="hidden" name="id" value={s.id} />
                  <input type="hidden" name="decision" value="approved" />
                  <button
                    type="submit"
                    className="rounded bg-navy-900 px-4 py-2 text-sm font-medium text-paper hover:bg-navy-800"
                  >
                    Publish
                  </button>
                </form>
                <form action={moderateApproval}>
                  <input type="hidden" name="token" value={token} />
                  <input type="hidden" name="id" value={s.id} />
                  <input type="hidden" name="decision" value="rejected" />
                  <button
                    type="submit"
                    className="rounded border border-charcoal-300 px-4 py-2 text-sm text-charcoal-700 hover:border-navy-900"
                  >
                    Reject
                  </button>
                </form>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
