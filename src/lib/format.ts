export function formatFee(fee: number | null): string {
  if (fee === null) return 'Not listed';
  if (fee === 0) return '$0';
  return `$${fee}`;
}

export function formatApr(min: number | null, max: number | null): string {
  if (min === null && max === null) return 'Not listed';
  if (min !== null && max !== null && min !== max) return `${min}%–${max}%`;
  const value = min ?? max;
  return `${value}%`;
}

export function formatIntroApr(
  introApr: number | null,
  months: number | null,
  isDeferredInterest: boolean
): string | null {
  if (introApr === null) return null;
  const term = months !== null ? ` for ${months} months` : '';
  const kind = isDeferredInterest ? ' (deferred interest)' : '';
  return `${introApr}% intro APR${term}${kind}`;
}
