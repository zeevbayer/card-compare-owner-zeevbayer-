import type { CardWithRelations } from './queries';

export type SortKey = 'annual-fee' | 'intro-apr-length' | 'welcome-offer';
export type SortDir = 'asc' | 'desc';

export interface FinderFilters {
  category?: string;
  feeMax?: number;
  tier?: string[];
  issuer?: string[];
  cardType?: string;
  introApr?: boolean;
  sort?: SortKey;
  dir?: SortDir;
}

const SORT_KEYS: SortKey[] = ['annual-fee', 'intro-apr-length', 'welcome-offer'];

function multiValues(params: URLSearchParams, key: string): string[] | undefined {
  const values = params.getAll(key).flatMap((v) => v.split(',')).filter(Boolean);
  return values.length ? values : undefined;
}

export function searchParamsToURLSearchParams(
  searchParams: Record<string, string | string[] | undefined>
): URLSearchParams {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(searchParams)) {
    if (Array.isArray(value)) {
      value.forEach((v) => params.append(key, v));
    } else if (value !== undefined) {
      params.set(key, value);
    }
  }
  return params;
}

export function parseFinderParams(params: URLSearchParams): FinderFilters {
  const category = params.get('category') || undefined;
  const feeMaxRaw = params.get('feeMax');
  const feeMax = feeMaxRaw !== null && feeMaxRaw !== '' ? Number(feeMaxRaw) : undefined;
  const tier = multiValues(params, 'tier');
  const issuer = multiValues(params, 'issuer');
  const cardType = params.get('cardType') || undefined;
  const introApr = params.get('introApr') === 'true' ? true : undefined;
  const sortRaw = params.get('sort');
  const sort = SORT_KEYS.includes(sortRaw as SortKey) ? (sortRaw as SortKey) : undefined;
  const dir = params.get('dir') === 'desc' ? 'desc' : 'asc';

  return {
    category,
    feeMax: Number.isFinite(feeMax) ? feeMax : undefined,
    tier,
    issuer,
    cardType,
    introApr,
    sort,
    dir,
  };
}

export function filterCards(cards: CardWithRelations[], filters: FinderFilters): CardWithRelations[] {
  return cards.filter((card) => {
    if (filters.category && !card.rewardRates.some((r) => r.category.slug === filters.category)) {
      return false;
    }
    if (filters.feeMax !== undefined) {
      if (card.annualFee === null || Number(card.annualFee) > filters.feeMax) return false;
    }
    if (filters.tier?.length && !filters.tier.includes(card.creditScoreTier)) return false;
    if (filters.issuer?.length && !filters.issuer.includes(card.issuer.slug)) return false;
    if (filters.cardType && card.cardType !== filters.cardType) return false;
    if (filters.introApr && card.introApr === null) return false;
    return true;
  });
}

export function sortCards(
  cards: CardWithRelations[],
  sort?: SortKey,
  dir: SortDir = 'asc'
): CardWithRelations[] {
  if (!sort) return cards;
  const sorted = [...cards].sort((a, b) => {
    let av: number;
    let bv: number;
    switch (sort) {
      case 'annual-fee':
        av = a.annualFee !== null ? Number(a.annualFee) : Number.POSITIVE_INFINITY;
        bv = b.annualFee !== null ? Number(b.annualFee) : Number.POSITIVE_INFINITY;
        break;
      case 'intro-apr-length':
        av = a.introAprMonths ?? -1;
        bv = b.introAprMonths ?? -1;
        break;
      case 'welcome-offer':
        av = a.welcomeOfferEstimatedValue !== null ? Number(a.welcomeOfferEstimatedValue) : -1;
        bv = b.welcomeOfferEstimatedValue !== null ? Number(b.welcomeOfferEstimatedValue) : -1;
        break;
    }
    return av - bv;
  });
  return dir === 'desc' ? sorted.reverse() : sorted;
}

export interface PresetDef {
  slug: string;
  title: string;
  shortLabel: string;
  intro: string;
  filters: FinderFilters;
}

export const PRESETS: PresetDef[] = [
  {
    slug: 'no-annual-fee',
    title: 'No Annual Fee Credit Cards',
    shortLabel: 'No Annual Fee',
    intro: 'Cards with a $0 annual fee, filtered from our verified card data.',
    filters: { feeMax: 0, sort: 'annual-fee' },
  },
  {
    slug: '0-apr',
    title: '0% Intro APR Credit Cards',
    shortLabel: '0% APR',
    intro:
      'Cards currently offering an introductory 0% purchase or balance transfer APR. Confirm whether each offer is a true promotional rate or deferred interest before you rely on it.',
    filters: { introApr: true, sort: 'intro-apr-length', dir: 'desc' },
  },
  {
    slug: 'starter-cards',
    title: 'Starter Credit Cards',
    shortLabel: 'Starter Cards',
    intro: 'Cards aimed at people building or repairing credit for the first time.',
    filters: { tier: ['fair', 'building'], sort: 'annual-fee' },
  },
  {
    slug: 'secured-cards',
    title: 'Secured Credit Cards',
    shortLabel: 'Secured Cards',
    intro: 'Cards that require a refundable cash deposit and report to the credit bureaus like any other card.',
    filters: { category: 'secured', sort: 'annual-fee' },
  },
  {
    slug: 'groceries',
    title: 'Best Credit Cards for Groceries',
    shortLabel: 'Groceries',
    intro: 'Cards with elevated rewards at U.S. supermarkets.',
    filters: { category: 'groceries', sort: 'annual-fee' },
  },
  {
    slug: 'gas',
    title: 'Best Credit Cards for Gas',
    shortLabel: 'Gas',
    intro: 'Cards with elevated rewards at gas stations.',
    filters: { category: 'gas', sort: 'annual-fee' },
  },
  {
    slug: 'dining',
    title: 'Best Credit Cards for Dining',
    shortLabel: 'Dining',
    intro: 'Cards with elevated rewards at restaurants.',
    filters: { category: 'dining', sort: 'annual-fee' },
  },
  {
    slug: 'travel',
    title: 'Best Travel Credit Cards',
    shortLabel: 'Travel',
    intro: 'Cards built around travel rewards — transferable points, airline miles, or elevated travel-category cash back.',
    filters: { category: 'travel', sort: 'annual-fee' },
  },
  {
    slug: 'luxury-travel',
    title: 'Best Luxury Travel Credit Cards',
    shortLabel: 'Luxury Travel',
    intro: 'Premium travel cards with the deepest benefit libraries — lounge access, elevated status, and travel protections.',
    filters: { category: 'luxury-travel', sort: 'annual-fee', dir: 'desc' },
  },
  {
    slug: 'airline',
    title: 'Best Airline Credit Cards',
    shortLabel: 'Airline Cards',
    intro: 'Co-branded and transferable-point cards built around airline travel.',
    filters: { category: 'airline', sort: 'annual-fee' },
  },
  {
    slug: 'hotel',
    title: 'Best Hotel Credit Cards',
    shortLabel: 'Hotel Cards',
    intro: 'Co-branded and transferable-point cards built around hotel stays.',
    filters: { category: 'hotel', sort: 'annual-fee' },
  },
  {
    slug: 'car-rental',
    title: 'Best Credit Cards for Car Rental',
    shortLabel: 'Car Rental',
    intro: 'Cards with rental car coverage or elevated rewards on rental car spending.',
    filters: { category: 'car-rental', sort: 'annual-fee' },
  },
  {
    slug: 'home-improvement',
    title: 'Best Credit Cards for Home Improvement',
    shortLabel: 'Home Improvement',
    intro: 'Cards with elevated rewards at home improvement retailers.',
    filters: { category: 'home-improvement', sort: 'annual-fee' },
  },
  {
    slug: 'office-supplies',
    title: 'Best Credit Cards for Office Supplies',
    shortLabel: 'Office Supplies',
    intro: 'Cards with elevated rewards at office supply retailers.',
    filters: { category: 'office-supplies', sort: 'annual-fee' },
  },
  {
    slug: 'drug-stores',
    title: 'Best Credit Cards for Drug Stores',
    shortLabel: 'Drug Stores',
    intro: 'Cards with elevated rewards at pharmacies and drug stores.',
    filters: { category: 'drugstores', sort: 'annual-fee' },
  },
  {
    slug: 'amazon',
    title: 'Best Credit Cards for Amazon',
    shortLabel: 'Amazon',
    intro: 'Cards with elevated rewards on Amazon purchases.',
    filters: { category: 'amazon', sort: 'annual-fee' },
  },
  {
    slug: 'shipping',
    title: 'Best Credit Cards for Shipping',
    shortLabel: 'Shipping',
    intro: 'Cards with elevated rewards on shipping and postage spending.',
    filters: { category: 'shipping', sort: 'annual-fee' },
  },
  {
    slug: 'balance-transfer',
    title: 'Best Balance Transfer Credit Cards',
    shortLabel: 'Balance Transfer',
    intro: 'Cards offering an introductory rate on transferred balances.',
    filters: { category: 'balance-transfer', sort: 'intro-apr-length', dir: 'desc' },
  },
];

export function getPreset(slug: string): PresetDef | undefined {
  return PRESETS.find((p) => p.slug === slug);
}

/**
 * Presets grouped for browsing. A flat list of 19 equal tiles gives the reader no way in;
 * grouping by the question they're actually asking does.
 */
export const PRESET_GROUPS: { heading: string; slugs: string[] }[] = [
  {
    heading: 'Your credit situation',
    slugs: ['starter-cards', 'secured-cards', 'no-annual-fee'],
  },
  {
    heading: 'Carrying or moving a balance',
    slugs: ['0-apr', 'balance-transfer'],
  },
  {
    heading: 'Everyday spending',
    slugs: ['groceries', 'gas', 'dining', 'drug-stores', 'amazon'],
  },
  {
    heading: 'Travel',
    slugs: ['travel', 'luxury-travel', 'airline', 'hotel', 'car-rental'],
  },
  {
    heading: 'Business spending',
    slugs: ['office-supplies', 'shipping', 'home-improvement'],
  },
];
