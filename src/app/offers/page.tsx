import type { Metadata } from 'next';
import Link from 'next/link';
import AffiliateDisclosureNotice from '@/components/AffiliateDisclosureNotice';
import VerifiedBadge from '@/components/VerifiedBadge';
import { getAllCardsWithRelations } from '@/lib/queries';
import { isOfferStale, daysUntil } from '@/lib/verification';
import { formatDate } from '@/lib/format';

export const metadata: Metadata = {
  title: 'Current Signup Bonus Offers',
  description:
    'Signup bonuses we have verified within the last 30 days. Expired or unverified offers are removed automatically.',
};

export default async function OffersPage() {
  const allCards = await getAllCardsWithRelations();

  const offers = allCards
    .filter((c) => c.welcomeOfferDescription && c.offerVerified)
    .filter((c) => !isOfferStale(c.offerVerified as string, c.expiresOn))
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="font-serif-heading text-3xl font-semibold text-navy-900">Current Offers</h1>
      <p className="mt-2 text-charcoal-700">
        Signup bonuses listed here were confirmed within the last 30 days. An offer disappears
        automatically once it expires or once our verification is more than 30 days old.
      </p>

      <div className="mt-6">
        <AffiliateDisclosureNotice />
      </div>

      <div className="mt-8 space-y-4">
        {offers.map((card) => {
          const isAffiliate = Boolean(card.affiliateUrl);
          const applyHref = card.affiliateUrl ?? card.issuerUrl;
          const remaining = card.expiresOn ? daysUntil(card.expiresOn) : null;
          return (
            <article key={card.id} className="rounded-lg border border-charcoal-300/60 bg-white p-5 shadow-sm">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wide text-charcoal-500">{card.issuer.name}</p>
                  <h2 className="font-serif-heading mt-0.5 text-lg font-semibold text-navy-900">
                    <Link href={`/cards/${card.slug}`} className="hover:text-amber-700">
                      {card.name}
                    </Link>
                  </h2>
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

              <p className="mt-4 text-base font-medium text-charcoal-900">{card.welcomeOfferDescription}</p>
              {(card.welcomeOfferSpendRequirement !== null || card.welcomeOfferWindow) && (
                <p className="mt-1 text-sm text-charcoal-600">
                  Requires{' '}
                  {card.welcomeOfferSpendRequirement !== null
                    ? `$${card.welcomeOfferSpendRequirement} in spend`
                    : 'qualifying spend'}
                  {card.welcomeOfferWindow ? ` within ${card.welcomeOfferWindow}` : ''}.
                </p>
              )}

              {remaining !== null && remaining >= 0 && (
                <p className="mt-2 text-sm text-amber-700">
                  {remaining} day{remaining === 1 ? '' : 's'} remaining
                </p>
              )}

              <div className="mt-4 border-t border-charcoal-300/60 pt-3">
                <p className="text-xs text-charcoal-500">
                  Offer verified {card.offerVerified ? formatDate(card.offerVerified) : ''}
                </p>
                <VerifiedBadge lastVerified={card.lastVerified} className="mt-1" />
              </div>
            </article>
          );
        })}
      </div>

      {offers.length === 0 && (
        <p className="mt-8 text-charcoal-600">
          No verified offers on file right now. Check back soon, or browse the full{' '}
          <Link href="/finder" className="text-amber-700 underline">
            card finder
          </Link>
          .
        </p>
      )}
    </div>
  );
}
