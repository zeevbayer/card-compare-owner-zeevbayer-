import { MIN_SAMPLE_FOR_STATS, type ApprovalStats } from '@/lib/approvals';
import ApprovalForm from './ApprovalForm';
import { formatDate } from '@/lib/format';

const BUREAU_LABEL: Record<string, string> = {
  experian: 'Experian',
  transunion: 'TransUnion',
  equifax: 'Equifax',
};

interface SubmissionRow {
  id: number;
  approved: boolean;
  creditScore: number | null;
  creditLimit: string | null;
  bureau: string | null;
  state: string | null;
  creditHistoryYears: string | null;
  notes: string | null;
  displayName: string | null;
  submittedAt: Date;
}

interface Props {
  cardSlug: string;
  cardName: string;
  stats: ApprovalStats;
  submissions: SubmissionRow[];
}

export default function ApprovalsMonitor({ cardSlug, cardName, stats, submissions }: Props) {
  return (
    <div className="mt-8 border-t border-charcoal-300/60 pt-6">
      <h2 className="font-serif-heading text-lg font-semibold text-navy-900">Approvals monitor</h2>

      {stats.total === 0 ? (
        <p className="mt-2 text-sm text-charcoal-600">
          No reports for this card yet. If you&apos;ve applied — approved or denied — adding yours
          is what makes this section useful for the next person.
        </p>
      ) : (
        <>
          <p className="mt-2 text-sm text-charcoal-600">
            Based on <strong className="text-charcoal-900">{stats.total}</strong> reader-submitted
            report{stats.total === 1 ? '' : 's'} ({stats.approvedCount} approved,{' '}
            {stats.deniedCount}{' '}denied). These are self-reported and unverified — issuers do not
            publish approval criteria, and people who get approved are likelier to report than
            people who don&apos;t.
          </p>

          {stats.hasEnoughForStats ? (
            <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-4 text-sm sm:grid-cols-3">
              <div>
                <dt className="text-xs text-charcoal-500">Approval rate</dt>
                <dd className="mt-0.5 font-medium text-charcoal-900 tabular-nums">
                  {stats.approvalRatePct}%
                </dd>
              </div>
              {stats.avgCreditScore !== null && (
                <div>
                  <dt className="text-xs text-charcoal-500">Avg. score (approved)</dt>
                  <dd className="mt-0.5 font-medium text-charcoal-900 tabular-nums">
                    {stats.avgCreditScore}
                    {stats.minCreditScore !== null && stats.maxCreditScore !== null && (
                      <span className="ml-1 font-normal text-charcoal-500">
                        ({stats.minCreditScore}–{stats.maxCreditScore})
                      </span>
                    )}
                  </dd>
                </div>
              )}
              {stats.avgCreditLimit !== null && (
                <div>
                  <dt className="text-xs text-charcoal-500">Avg. limit (approved)</dt>
                  <dd className="mt-0.5 font-medium text-charcoal-900 tabular-nums">
                    ${stats.avgCreditLimit.toLocaleString()}
                    {stats.minCreditLimit !== null && stats.maxCreditLimit !== null && (
                      <span className="ml-1 font-normal text-charcoal-500">
                        (${stats.minCreditLimit.toLocaleString()}–$
                        {stats.maxCreditLimit.toLocaleString()})
                      </span>
                    )}
                  </dd>
                </div>
              )}
            </dl>
          ) : (
            <p className="mt-3 rounded border border-charcoal-300/60 bg-paper-dim px-4 py-3 text-sm text-charcoal-700">
              Not enough reports yet to show an approval rate or averages — we hold those back
              until there are at least {MIN_SAMPLE_FOR_STATS}. A percentage drawn from a handful of
              reports looks authoritative and isn&apos;t. Individual reports are below.
            </p>
          )}

          {stats.bureauCounts.length > 0 && (
            <div className="mt-5">
              <h3 className="text-xs font-medium uppercase tracking-wide text-charcoal-500">
                Credit bureau pulled — as reported
              </h3>
              <ul className="mt-2 flex flex-wrap gap-2 text-sm">
                {stats.bureauCounts.map((b) => (
                  <li
                    key={b.bureau}
                    className="rounded-full border border-charcoal-300 px-3 py-1 text-charcoal-700"
                  >
                    {BUREAU_LABEL[b.bureau] ?? b.bureau}:{' '}
                    <span className="tabular-nums">{b.count}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-2 text-xs text-charcoal-500">
                Issuers don&apos;t disclose which bureau they pull, and it varies by applicant and
                state. Treat this as a pattern, not a rule.
              </p>
            </div>
          )}

          {submissions.length > 0 && (
            <div className="mt-6">
              <h3 className="text-xs font-medium uppercase tracking-wide text-charcoal-500">
                Recent reports
              </h3>
              <ul className="mt-3 space-y-3">
                {submissions.map((s) => (
                  <li key={s.id} className="rounded border border-charcoal-300/60 px-4 py-3 text-sm">
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <span
                        className={`font-medium ${s.approved ? 'text-navy-900' : 'text-charcoal-600'}`}
                      >
                        {s.approved ? 'Approved' : 'Denied'}
                      </span>
                      {s.creditScore !== null && (
                        <span className="text-charcoal-700 tabular-nums">Score {s.creditScore}</span>
                      )}
                      {s.approved && s.creditLimit !== null && (
                        <span className="text-charcoal-700 tabular-nums">
                          Limit ${Number(s.creditLimit).toLocaleString()}
                        </span>
                      )}
                      {s.bureau && (
                        <span className="text-charcoal-700">{BUREAU_LABEL[s.bureau] ?? s.bureau}</span>
                      )}
                      {s.state && <span className="text-charcoal-700">{s.state}</span>}
                      {s.creditHistoryYears !== null && (
                        <span className="text-charcoal-700 tabular-nums">
                          {Number(s.creditHistoryYears)} yr history
                        </span>
                      )}
                    </div>
                    {s.notes && <p className="mt-1.5 text-charcoal-700">{s.notes}</p>}
                    <p className="mt-1.5 text-xs text-charcoal-500">
                      {s.displayName || 'Anonymous'} · {formatDate(s.submittedAt)}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}

      <ApprovalForm cardSlug={cardSlug} cardName={cardName} />
    </div>
  );
}
