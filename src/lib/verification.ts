const DAY_MS = 24 * 60 * 60 * 1000;

export function daysSince(date: Date | string, now: Date = new Date()): number {
  const d = typeof date === 'string' ? new Date(date) : date;
  return Math.floor((now.getTime() - d.getTime()) / DAY_MS);
}

export function daysUntil(date: Date | string, now: Date = new Date()): number {
  const d = typeof date === 'string' ? new Date(date) : date;
  return Math.ceil((d.getTime() - now.getTime()) / DAY_MS);
}

export function isUnverified(lastVerified: Date | string | null): boolean {
  return lastVerified === null;
}

export function needsReverification(
  lastVerified: Date | string | null,
  now: Date = new Date()
): boolean {
  if (lastVerified === null) return false;
  const d = typeof lastVerified === 'string' ? new Date(lastVerified) : lastVerified;
  return daysSince(d, now) > 90;
}

export function isOfferStale(
  offerVerified: Date | string,
  expiresOn: Date | string | null,
  now: Date = new Date()
): boolean {
  const verified = typeof offerVerified === 'string' ? new Date(offerVerified) : offerVerified;
  if (expiresOn) {
    const expires = typeof expiresOn === 'string' ? new Date(expiresOn) : expiresOn;
    if (now.getTime() > expires.getTime()) return true;
  }
  return daysSince(verified, now) > 30;
}
