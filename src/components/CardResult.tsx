import Link from 'next/link';
import type { CardWithRelations } from '@/lib/queries';
import VerifiedBadge from './VerifiedBadge';
import { formatFee, formatApr, formatIntroApr } from '@/lib/format';

const tierLabel: Record<string, string> = {
  excellent: 'Excellent credit',
  good: 'Good credit',
  fair: 'Fair credit',
  building: 'Building credit',
};

export default function CardResult({ card }: { card: CardWithRelations }) {
  const isAffiliate = Boolean(card.affiliateUrl);
  const applyHref = card.affiliateUrl ?? card.issuerUrl;
  const introAprText = formatIntroApr(card.introApr, card.introAprMonths, card.isDeferredInterest);
  const categories = card.rewardRates.map((r) => r.category.label);

  return (
    <article className="rounded-lg border border-charcoal-300/60 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-wide text-charcoal-500">{card.issuer.name}</p>
          <h3 className="font-serif-heading mt-0.5 text-lg font-semibold text-navy-900">
            <Link href={`/cards/${card.slug}`} className="hover:text-amber-700">
              {card.name}
            </Link>
          </h3>
          {categories.length > 0 && (
            <p className="mt-1 text-xs text-charcoal-500">{categories.join(' · ')}</p>
          )}
        </div>
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 border-y border-charcoal-300/40 py-4 text-sm sm:grid-cols-4">
        <div>
          <dt className="text-xs text-charcoal-500">Annual fee</dt>
          <dd className="mt-0.5 font-medium tabular-nums text-charcoal-900">
            {formatFee(card.annualFee)}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-charcoal-500">Purchase APR</dt>
          <dd className="mt-0.5 font-medium tabular-nums text-charcoal-900">
            {formatApr(card.purchaseAprMin, card.purchaseAprMax)}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-charcoal-500">Credit needed</dt>
          <dd className="mt-0.5 font-medium text-charcoal-900">{tierLabel[card.creditScoreTier]}</dd>
        </div>
        <div>
          <dt className="text-xs text-charcoal-500">Welcome offer</dt>
          <dd className="mt-0.5 font-medium text-charcoal-900">
            {card.welcomeOfferDescription ?? 'None listed'}
          </dd>
        </div>
      </dl>

      {introAprText && (
        <p className="mt-3 text-sm text-charcoal-700">
          <span className="font-medium text-charcoal-900">{introAprText}</span>
          {card.isDeferredInterest && (
            <span className="ml-1 text-amber-700">
              — interest is charged retroactively if a balance remains.
            </span>
          )}
        </p>
      )}

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <VerifiedBadge lastVerified={card.lastVerified} />
        <div className="flex shrink-0 flex-wrap items-center gap-x-4 gap-y-2">
          {/* Primary action is the full breakdown on this site — not a click straight into an
              application. The outbound link stays available, but as the terms, not a CTA. */}
          <Link
            href={`/cards/${card.slug}`}
            className="rounded border border-navy-900 px-4 py-2 text-sm font-medium text-navy-900 transition-colors hover:bg-navy-900 hover:text-paper"
          >
            Full details
          </Link>
          <a
            href={applyHref}
            target="_blank"
            rel={isAffiliate ? 'sponsored nofollow noopener' : 'noopener'}
            className="text-sm text-charcoal-600 underline underline-offset-4 hover:text-amber-700"
          >
            Rates &amp; fees at issuer
          </a>
        </div>
      </div>
    </article>
  );
}
