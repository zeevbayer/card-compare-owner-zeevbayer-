import { db } from '@/db';
import { approvalSubmissions } from '@/db/schema';
import { and, desc, eq, gte, sql } from 'drizzle-orm';

/**
 * Below this many published reports we show the individual reports but refuse to render
 * headline statistics (approval rate, average score/limit). A "70% approval rate" derived
 * from three self-selected reports is worse than no number at all.
 */
export const MIN_SAMPLE_FOR_STATS = 5;

export interface ApprovalStats {
  total: number;
  approvedCount: number;
  deniedCount: number;
  approvalRatePct: number | null;
  avgCreditScore: number | null;
  minCreditScore: number | null;
  maxCreditScore: number | null;
  avgCreditLimit: number | null;
  minCreditLimit: number | null;
  maxCreditLimit: number | null;
  bureauCounts: { bureau: string; count: number }[];
  hasEnoughForStats: boolean;
}

function toNumber(value: unknown): number | null {
  if (value === null || value === undefined) return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

export async function getApprovalStats(cardId: number): Promise<ApprovalStats> {
  const rows = await db
    .select()
    .from(approvalSubmissions)
    .where(
      and(eq(approvalSubmissions.cardId, cardId), eq(approvalSubmissions.status, 'approved'))
    );

  const total = rows.length;
  const approvedRows = rows.filter((r) => r.approved);
  const approvedCount = approvedRows.length;
  const deniedCount = total - approvedCount;

  // Score/limit stats describe *approved* applications only — averaging a denial's limit of
  // null or a denied applicant's score into an "average approved limit" would be misleading.
  const scores = approvedRows
    .map((r) => toNumber(r.creditScore))
    .filter((n): n is number => n !== null);
  const limits = approvedRows
    .map((r) => toNumber(r.creditLimit))
    .filter((n): n is number => n !== null);

  const bureauMap = new Map<string, number>();
  for (const r of rows) {
    if (r.bureau) bureauMap.set(r.bureau, (bureauMap.get(r.bureau) ?? 0) + 1);
  }

  const hasEnoughForStats = total >= MIN_SAMPLE_FOR_STATS;

  return {
    total,
    approvedCount,
    deniedCount,
    approvalRatePct: hasEnoughForStats && total > 0 ? Math.round((approvedCount / total) * 100) : null,
    avgCreditScore:
      hasEnoughForStats && scores.length
        ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
        : null,
    minCreditScore: scores.length ? Math.min(...scores) : null,
    maxCreditScore: scores.length ? Math.max(...scores) : null,
    avgCreditLimit:
      hasEnoughForStats && limits.length
        ? Math.round(limits.reduce((a, b) => a + b, 0) / limits.length)
        : null,
    minCreditLimit: limits.length ? Math.min(...limits) : null,
    maxCreditLimit: limits.length ? Math.max(...limits) : null,
    bureauCounts: [...bureauMap.entries()]
      .map(([bureau, count]) => ({ bureau, count }))
      .sort((a, b) => b.count - a.count),
    hasEnoughForStats,
  };
}

export async function getPublishedSubmissions(cardId: number, limit = 25) {
  return db
    .select()
    .from(approvalSubmissions)
    .where(and(eq(approvalSubmissions.cardId, cardId), eq(approvalSubmissions.status, 'approved')))
    .orderBy(desc(approvalSubmissions.submittedAt))
    .limit(limit);
}

export interface ApprovalBrowseFilters {
  issuerSlug?: string;
  bureau?: string;
  state?: string;
  sinceDays?: number;
  sort?: 'recent' | 'score-asc' | 'score-desc' | 'limit-asc' | 'limit-desc';
}

export async function browseSubmissions(filters: ApprovalBrowseFilters, limit = 100) {
  const conditions = [eq(approvalSubmissions.status, 'approved')];

  if (filters.bureau) {
    conditions.push(eq(approvalSubmissions.bureau, filters.bureau as 'experian' | 'transunion' | 'equifax'));
  }
  if (filters.state) {
    conditions.push(eq(approvalSubmissions.state, filters.state.toUpperCase()));
  }
  if (filters.sinceDays) {
    const cutoff = new Date(Date.now() - filters.sinceDays * 24 * 60 * 60 * 1000);
    conditions.push(gte(approvalSubmissions.submittedAt, cutoff));
  }

  const orderBy = (() => {
    switch (filters.sort) {
      case 'score-asc':
        return sql`${approvalSubmissions.creditScore} ASC NULLS LAST`;
      case 'score-desc':
        return sql`${approvalSubmissions.creditScore} DESC NULLS LAST`;
      case 'limit-asc':
        return sql`${approvalSubmissions.creditLimit} ASC NULLS LAST`;
      case 'limit-desc':
        return sql`${approvalSubmissions.creditLimit} DESC NULLS LAST`;
      default:
        return desc(approvalSubmissions.submittedAt);
    }
  })();

  const rows = await db.query.approvalSubmissions.findMany({
    where: and(...conditions),
    with: { card: { with: { issuer: true } } },
    orderBy,
    limit,
  });

  if (filters.issuerSlug) {
    return rows.filter((r) => r.card.issuer.slug === filters.issuerSlug);
  }
  return rows;
}

export async function getPendingSubmissions() {
  return db.query.approvalSubmissions.findMany({
    where: eq(approvalSubmissions.status, 'pending'),
    with: { card: { with: { issuer: true } } },
    orderBy: desc(approvalSubmissions.submittedAt),
    limit: 200,
  });
}
