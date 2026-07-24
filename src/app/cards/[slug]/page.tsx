import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import VerifiedBadge from '@/components/VerifiedBadge';
import AffiliateDisclosureNotice from '@/components/AffiliateDisclosureNotice';
import { getCardBySlug, getAllCardSlugs } from '@/lib/queries';
import { formatFee, formatApr, formatIntroApr } from '@/lib/format';
import { isUnverified } from '@/lib/verification';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const cards = await getAllCardSlugs();
  return cards.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const card = await getCardBySlug(slug);
  if (!card) return {};
  return {
    title: `${card.name} Review`,
    description: `${card.name} from ${card.issuer.name}: annual fee, APR, rewards, and verified terms.`,
  };
}

const tierLabel: Record<string, string> = {
  excellent: 'Excellent credit',
  good: 'Good credit',
  fair: 'Fair credit',
  building: 'Building credit',
};

const bureauLabel: Record<string, string> = {
  experian: 'Experian',
  transunion: 'TransUnion',
  equifax: 'Equifax',
};

export default async function CardPage({ params }: PageProps) {
  const { slug } = await params;
  const card = await getCardBySlug(slug);
  if (!card) notFound();

  const isAffiliate = Boolean(card.affiliateUrl);
  const applyHref = card.affiliateUrl ?? card.issuerUrl;
  const introAprText = formatIntroApr(card.introApr, card.introAprMonths, card.isDeferredInterest);
  const unverified = isUnverified(card.lastVerified);
  const approvedCount = card.approvalSubmissions.length;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <p className="text-sm text-charcoal-500">
        <Link href="/finder" className="hover:text-amber-700">
          Card Finder
        </Link>{' '}
        / {card.issuer.name}
      </p>
      <h1 className="font-serif-heading mt-2 text-3xl font-semibold text-navy-900">{card.name}</h1>
      <p className="mt-1 text-charcoal-500">
        {card.issuer.name}
        {card.rewardsProgram ? ` · Earns ${card.rewardsProgram.label}` : ''}
      </p>

      <div className="mt-6">
        <AffiliateDisclosureNotice />
      </div>

      {unverified && (
        <p className="mt-6 rounded border border-amber-600 bg-amber-100 px-4 py-3 text-sm text-amber-700">
          We have not yet verified current terms for this card. Figures below may be incomplete.
          Confirm directly with the issuer before applying.
        </p>
      )}

      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <VerifiedBadge lastVerified={card.lastVerified} />
        <a
          href={applyHref}
          target="_blank"
          rel={isAffiliate ? 'sponsored nofollow noopener' : 'noopener'}
          className="inline-block rounded border border-navy-900 px-5 py-2.5 text-center text-sm font-medium text-navy-900 transition-colors hover:bg-navy-900 hover:text-paper"
        >
          View at issuer
        </a>
      </div>

      {/* Core offer summary */}
      <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-charcoal-300/60 pt-6 text-sm sm:grid-cols-3">
        <div>
          <dt className="text-xs text-charcoal-500">Annual fee</dt>
          <dd className="mt-0.5 font-medium text-charcoal-900">{formatFee(card.annualFee)}</dd>
        </div>
        <div>
          <dt className="text-xs text-charcoal-500">Purchase APR</dt>
          <dd className="mt-0.5 font-medium text-charcoal-900">
            {formatApr(card.purchaseAprMin, card.purchaseAprMax)}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-charcoal-500">Credit needed</dt>
          <dd className="mt-0.5 font-medium text-charcoal-900">{tierLabel[card.creditScoreTier]}</dd>
        </div>
        <div>
          <dt className="text-xs text-charcoal-500">Balance transfer fee</dt>
          <dd className="mt-0.5 font-medium text-charcoal-900">
            {card.balanceTransferFeePct !== null ? `${card.balanceTransferFeePct}%` : 'Not listed'}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-charcoal-500">Foreign transaction fee</dt>
          <dd className="mt-0.5 font-medium text-charcoal-900">
            {card.foreignTransactionFeePct !== null ? `${card.foreignTransactionFeePct}%` : 'Not listed'}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-charcoal-500">Welcome offer</dt>
          <dd className="mt-0.5 font-medium text-charcoal-900">
            {card.welcomeOfferDescription ?? 'Not listed'}
          </dd>
        </div>
      </dl>

      {introAprText && (
        <p className="mt-6 rounded bg-paper-dim px-4 py-3 text-sm text-charcoal-700">{introAprText}</p>
      )}

      {card.welcomeOfferDescription && (card.welcomeOfferSpendRequirement !== null || card.welcomeOfferWindow) && (
        <p className="mt-3 text-sm text-charcoal-600">
          Requires{' '}
          {card.welcomeOfferSpendRequirement !== null
            ? `$${card.welcomeOfferSpendRequirement} in spend`
            : 'qualifying spend'}
          {card.welcomeOfferWindow ? ` within ${card.welcomeOfferWindow}` : ''}.
        </p>
      )}

      {/* Overview */}
      {card.overview && (
        <div className="mt-8 border-t border-charcoal-300/60 pt-6">
          <h2 className="font-serif-heading text-lg font-semibold text-navy-900">Overview</h2>
          <p className="mt-2 text-charcoal-700">{card.overview}</p>
          {card.bestFor && <p className="mt-2 text-charcoal-700">{card.bestFor}</p>}
        </div>
      )}

      {/* Rewards breakdown */}
      {card.rewardRates.length > 0 && (
        <div className="mt-8 border-t border-charcoal-300/60 pt-6">
          <h2 className="font-serif-heading text-lg font-semibold text-navy-900">Rewards breakdown</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {card.rewardRates.map((r) => (
              <li key={r.category.slug} className="flex items-center justify-between border-b border-charcoal-300/40 pb-2">
                <span className="text-charcoal-700">{r.category.label}</span>
                <span className="font-medium text-charcoal-900">
                  {r.ratePct !== null ? `${r.ratePct}%` : 'Rate not listed'}
                  {r.cap ? ` · ${r.cap}` : ''}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Credits */}
      {card.credits.length > 0 && (
        <div className="mt-8 border-t border-charcoal-300/60 pt-6">
          <h2 className="font-serif-heading text-lg font-semibold text-navy-900">Credits</h2>
          <ul className="mt-3 space-y-3 text-sm">
            {card.credits.map((credit) => (
              <li key={credit.id}>
                <p className="font-medium text-charcoal-900">
                  {credit.label}
                  {credit.valueAmount !== null ? ` — $${credit.valueAmount}` : ''}
                  {credit.frequency ? ` (${credit.frequency})` : ''}
                </p>
                {credit.redemptionConditions && (
                  <p className="text-charcoal-600">{credit.redemptionConditions}</p>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Benefits library */}
      {card.cardBenefits.length > 0 && (
        <div className="mt-8 border-t border-charcoal-300/60 pt-6">
          <h2 className="font-serif-heading text-lg font-semibold text-navy-900">Benefits</h2>
          <ul className="mt-3 grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
            {card.cardBenefits.map((cb) => (
              <li key={cb.benefit.slug} className="rounded border border-charcoal-300/60 px-3 py-2">
                <p className="font-medium text-charcoal-900">{cb.benefit.label}</p>
                {cb.details && <p className="mt-0.5 text-xs text-charcoal-600">{cb.details}</p>}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Application tips */}
      {(card.likelyCreditBureau ||
        card.applicationNotes ||
        card.reconsiderationPhone ||
        card.applicationStatusPhone) && (
        <div className="mt-8 border-t border-charcoal-300/60 pt-6">
          <h2 className="font-serif-heading text-lg font-semibold text-navy-900">Application tips</h2>
          <dl className="mt-3 space-y-3 text-sm">
            {card.likelyCreditBureau && (
              <div>
                <dt className="text-xs text-charcoal-500">Likely credit bureau pulled</dt>
                <dd className="font-medium text-charcoal-900">{bureauLabel[card.likelyCreditBureau]}</dd>
              </div>
            )}
            {card.applicationStatusPhone && (
              <div>
                <dt className="text-xs text-charcoal-500">Application status line</dt>
                <dd className="font-medium text-charcoal-900">{card.applicationStatusPhone}</dd>
              </div>
            )}
            {card.reconsiderationPhone && (
              <div>
                <dt className="text-xs text-charcoal-500">Reconsideration line</dt>
                <dd className="font-medium text-charcoal-900">{card.reconsiderationPhone}</dd>
              </div>
            )}
            {card.applicationNotes && (
              <div>
                <dt className="text-xs text-charcoal-500">Notes</dt>
                <dd className="text-charcoal-700">{card.applicationNotes}</dd>
              </div>
            )}
          </dl>
        </div>
      )}

      {/* Approvals monitor — phase 2 */}
      <div className="mt-8 border-t border-charcoal-300/60 pt-6">
        <h2 className="font-serif-heading text-lg font-semibold text-navy-900">Approvals monitor</h2>
        {approvedCount > 0 ? (
          <p className="mt-2 text-sm text-charcoal-700">
            Based on {approvedCount} community-submitted result{approvedCount === 1 ? '' : 's'}.
          </p>
        ) : (
          <p className="mt-2 text-sm text-charcoal-500">
            Community-submitted approval data isn&apos;t open yet — this section is reserved for
            it. Once submissions open, real approval odds will show here instead of a guess.
          </p>
        )}
      </div>

      <p className="mt-8 text-xs text-charcoal-500">
        Categories: {card.rewardRates.map((r) => r.category.label).join(', ') || 'None listed'}
      </p>
    </div>
  );
}
