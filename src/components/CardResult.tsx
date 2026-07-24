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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
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
        <a
          href={applyHref}
          target="_blank"
          rel={isAffiliate ? 'sponsored nofollow noopener' : 'noopener'}
          className="inline-block shrink-0 rounded border border-navy-900 px-4 py-2 text-center text-sm font-medium text-navy-900 transition-colors hover:bg-navy-900 hover:text-paper"
        >
          View at issuer
        </a>
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 text-sm sm:grid-cols-4">
        <div>
          <dt className="text-xs text-charcoal-500">Annual fee</dt>
          <dd className="font-medium text-charcoal-900">{formatFee(card.annualFee)}</dd>
        </div>
        <div>
          <dt className="text-xs text-charcoal-500">Purchase APR</dt>
          <dd className="font-medium text-charcoal-900">
            {formatApr(card.purchaseAprMin, card.purchaseAprMax)}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-charcoal-500">Credit needed</dt>
          <dd className="font-medium text-charcoal-900">{tierLabel[card.creditScoreTier]}</dd>
        </div>
        <div>
          <dt className="text-xs text-charcoal-500">Welcome offer</dt>
          <dd className="font-medium text-charcoal-900">
            {card.welcomeOfferDescription ?? 'Not listed'}
          </dd>
        </div>
      </dl>

      {introAprText && <p className="mt-3 text-sm text-charcoal-700">{introAprText}</p>}
      {card.overview && <p className="mt-2 text-sm text-charcoal-700">{card.overview}</p>}

      <VerifiedBadge lastVerified={card.lastVerified} className="mt-4 border-t border-charcoal-300/60 pt-3" />
    </article>
  );
}
