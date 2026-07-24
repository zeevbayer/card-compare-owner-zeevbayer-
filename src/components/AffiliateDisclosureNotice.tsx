import Link from 'next/link';

export default function AffiliateDisclosureNotice() {
  return (
    <p className="rounded border border-navy-700 bg-navy-900/5 px-4 py-3 text-sm leading-relaxed text-charcoal-700">
      This page includes cards we have an affiliate relationship with, and cards we do not.
      Whether a card pays us a commission has no effect on how it is described, filtered, or
      ordered here. See{' '}
      <Link href="/how-we-make-money" className="text-amber-700 underline hover:text-amber-600">
        how we make money
      </Link>
      .
    </p>
  );
}
