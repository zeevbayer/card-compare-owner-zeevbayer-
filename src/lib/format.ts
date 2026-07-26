export function formatFee(fee: string | number | null): string {
  if (fee === null) return 'Not listed';
  const n = Number(fee);
  if (n === 0) return '$0';
  return `$${n}`;
}

export function formatApr(
  min: string | number | null,
  max: string | number | null
): string {
  if (min === null && max === null) return 'Not listed';
  const minN = min !== null ? Number(min) : null;
  const maxN = max !== null ? Number(max) : null;
  if (minN !== null && maxN !== null && minN !== maxN) return `${minN}%–${maxN}%`;
  const value = minN ?? maxN;
  return `${value}%`;
}

export function formatIntroApr(
  introApr: string | number | null,
  months: number | null,
  isDeferredInterest: boolean
): string | null {
  if (introApr === null) return null;
  const term = months !== null ? ` for ${months} months` : '';
  const kind = isDeferredInterest ? ' (deferred interest)' : '';
  return `${Number(introApr)}% intro APR${term}${kind}`;
}

/** Money from a numeric DB column: "500.00" -> "$500", "1500.50" -> "$1,500.50". */
export function formatMoney(value: string | number | null): string | null {
  if (value === null) return null;
  const n = Number(value);
  if (!Number.isFinite(n)) return null;
  return `$${n.toLocaleString('en-US', { maximumFractionDigits: 2 })}`;
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}
