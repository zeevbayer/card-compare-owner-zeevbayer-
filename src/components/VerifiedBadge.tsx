import { needsReverification } from '@/lib/verification';
import { formatDate } from '@/lib/format';

interface Props {
  lastVerified: string | null;
  className?: string;
}

export default function VerifiedBadge({ lastVerified, className = '' }: Props) {
  const stale = needsReverification(lastVerified);

  if (lastVerified === null) {
    return <p className={`text-xs font-medium text-charcoal-500 ${className}`}>Terms not yet verified</p>;
  }

  return (
    <div className={className}>
      <p className="text-xs text-charcoal-500">Terms last verified {formatDate(lastVerified)}</p>
      {stale && (
        <p className="mt-0.5 text-xs font-medium text-amber-700">
          More than 90 days ago — verify current terms with the issuer before applying.
        </p>
      )}
    </div>
  );
}
