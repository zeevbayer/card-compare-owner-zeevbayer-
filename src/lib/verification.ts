const DAY_MS = 24 * 60 * 60 * 1000;

export function daysSince(date: Date, now: Date = new Date()): number {
  return Math.floor((now.getTime() - date.getTime()) / DAY_MS);
}

export function daysUntil(date: Date, now: Date = new Date()): number {
  return Math.ceil((date.getTime() - now.getTime()) / DAY_MS);
}

/** Card has never been verified — must be excluded from finder results by default. */
export function isUnverified(lastVerified: Date | null): boolean {
  return lastVerified === null;
}

/** Verified more than 90 days ago — show a "verify current terms" notice. */
export function needsReverification(lastVerified: Date | null, now: Date = new Date()): boolean {
  if (lastVerified === null) return false;
  return daysSince(lastVerified, now) > 90;
}

/** Offer is stale: past its expiry date, or verified more than 30 days ago. Must never display. */
export function isOfferStale(
  offerVerified: Date,
  expiresOn: Date | null,
  now: Date = new Date()
): boolean {
  if (expiresOn && now.getTime() > expiresOn.getTime()) return true;
  return daysSince(offerVerified, now) > 30;
}
