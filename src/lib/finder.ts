import type { CollectionEntry } from 'astro:content';
import { isUnverified } from './verification';
import { slugify } from './slugify';

export type CardEntry = CollectionEntry<'cards'>;

export type SortKey = 'annual-fee' | 'intro-apr-length' | 'signup-bonus';
export type SortDir = 'asc' | 'desc';

export interface FinderFilters {
  category?: string;
  feeMax?: number;
  tier?: string[];
  issuer?: string[];
  introApr?: boolean;
  sort?: SortKey;
  dir?: SortDir;
}

const SORT_KEYS: SortKey[] = ['annual-fee', 'intro-apr-length', 'signup-bonus'];

function multiValues(params: URLSearchParams, key: string): string[] | undefined {
  const values = params.getAll(key).flatMap((v) => v.split(',')).filter(Boolean);
  return values.length ? values : undefined;
}

export function parseFinderParams(params: URLSearchParams): FinderFilters {
  const category = params.get('category') || undefined;
  const feeMaxRaw = params.get('feeMax');
  const feeMax = feeMaxRaw !== null && feeMaxRaw !== '' ? Number(feeMaxRaw) : undefined;
  const tier = multiValues(params, 'tier');
  const issuer = multiValues(params, 'issuer');
  const introApr = params.get('introApr') === 'true' ? true : undefined;
  const sortRaw = params.get('sort');
  const sort = SORT_KEYS.includes(sortRaw as SortKey) ? (sortRaw as SortKey) : undefined;
  const dir = params.get('dir') === 'desc' ? 'desc' : 'asc';

  return {
    category,
    feeMax: Number.isFinite(feeMax) ? feeMax : undefined,
    tier,
    issuer,
    introApr,
    sort,
    dir,
  };
}

export function finderFiltersToSearchParams(filters: FinderFilters): URLSearchParams {
  const params = new URLSearchParams();
  if (filters.category) params.set('category', filters.category);
  if (filters.feeMax !== undefined) params.set('feeMax', String(filters.feeMax));
  if (filters.tier?.length) params.set('tier', filters.tier.join(','));
  if (filters.issuer?.length) params.set('issuer', filters.issuer.join(','));
  if (filters.introApr) params.set('introApr', 'true');
  if (filters.sort) params.set('sort', filters.sort);
  if (filters.dir && filters.dir !== 'asc') params.set('dir', filters.dir);
  return params;
}

/** Cards with no lastVerified date are excluded from finder results by default. */
export function eligibleCards(cards: CardEntry[]): CardEntry[] {
  return cards.filter((card) => !isUnverified(card.data.lastVerified));
}

export function filterCards(cards: CardEntry[], filters: FinderFilters): CardEntry[] {
  return cards.filter((card) => {
    const d = card.data;
    if (filters.category && !d.categories.includes(filters.category)) return false;
    if (filters.feeMax !== undefined) {
      if (d.annualFee === null || d.annualFee > filters.feeMax) return false;
    }
    if (filters.tier?.length && !filters.tier.includes(d.creditScoreTier)) return false;
    if (filters.issuer?.length && !filters.issuer.includes(slugify(d.issuer))) return false;
    if (filters.introApr && (d.introApr === null || d.introApr === undefined)) return false;
    return true;
  });
}

function bonusAmount(signupBonus: string | null): number {
  if (!signupBonus) return -1;
  const match = signupBonus.replace(/,/g, '').match(/\d+(\.\d+)?/);
  return match ? Number(match[0]) : -1;
}

export function sortCards(cards: CardEntry[], sort?: SortKey, dir: SortDir = 'asc'): CardEntry[] {
  if (!sort) return cards;
  const sorted = [...cards].sort((a, b) => {
    let av: number;
    let bv: number;
    switch (sort) {
      case 'annual-fee':
        av = a.data.annualFee ?? Number.POSITIVE_INFINITY;
        bv = b.data.annualFee ?? Number.POSITIVE_INFINITY;
        break;
      case 'intro-apr-length':
        av = a.data.introAprMonths ?? -1;
        bv = b.data.introAprMonths ?? -1;
        break;
      case 'signup-bonus':
        av = bonusAmount(a.data.signupBonus);
        bv = bonusAmount(b.data.signupBonus);
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
    intro:
      'Cards with a $0 annual fee, filtered from our verified card data. No fee does not mean no cost — check the purchase APR and any intro-rate terms below before applying.',
    filters: { feeMax: 0, sort: 'annual-fee' },
  },
  {
    slug: '0-intro-apr',
    title: '0% Intro APR Credit Cards',
    shortLabel: '0% Intro APR',
    intro:
      'Cards currently offering an introductory 0% purchase or balance transfer APR. Confirm whether each offer is a true promotional rate or deferred interest before you rely on it — see our explainer on the difference.',
    filters: { introApr: true, sort: 'intro-apr-length', dir: 'desc' },
  },
  {
    slug: 'starter-first-card',
    title: 'Starter Cards for a First-Time Applicant',
    shortLabel: 'Starter / First Card',
    intro:
      'Cards aimed at people building credit for the first time or repairing a fair credit history. These generally approve thinner files than premium travel or cash-back cards.',
    filters: { tier: ['fair', 'building'], sort: 'annual-fee' },
  },
  {
    slug: 'secured-cards',
    title: 'Secured Credit Cards',
    shortLabel: 'Secured Cards',
    intro:
      'Secured cards require a refundable cash deposit that typically sets your credit limit. They report to the credit bureaus like any other card and are a common way to build or rebuild credit history.',
    filters: { category: 'secured', sort: 'annual-fee' },
  },
  {
    slug: 'cash-back',
    title: 'Cash Back Credit Cards',
    shortLabel: 'Cash Back',
    intro:
      'Cards that pay a percentage of purchases back as statement credit, direct deposit, or a check. Flat-rate and category-based structures behave very differently depending on how you actually spend.',
    filters: { category: 'cash-back', sort: 'annual-fee' },
  },
  {
    slug: 'groceries',
    title: 'Best Credit Cards for Groceries',
    shortLabel: 'Groceries',
    intro:
      'Cards with elevated rewards at U.S. supermarkets. Category bonuses are frequently capped at an annual or quarterly spending amount — read the fine print on each card page.',
    filters: { category: 'groceries', sort: 'annual-fee' },
  },
  {
    slug: 'gas',
    title: 'Best Credit Cards for Gas',
    shortLabel: 'Gas',
    intro:
      'Cards with elevated rewards at gas stations. As with grocery bonuses, gas-category rewards are often capped — the sustained rate can be lower than the headline number suggests.',
    filters: { category: 'gas', sort: 'annual-fee' },
  },
  {
    slug: 'travel',
    title: 'Best Travel Credit Cards',
    shortLabel: 'Travel',
    intro:
      'Cards built around travel rewards: transferable points, airline miles, or elevated travel-category cash back. Many carry an annual fee that only pays off with regular travel spending.',
    filters: { category: 'travel', sort: 'annual-fee' },
  },
  {
    slug: 'balance-transfer',
    title: 'Best Balance Transfer Credit Cards',
    shortLabel: 'Balance Transfer',
    intro:
      'Cards offering an introductory rate on transferred balances, meant to give you time to pay down debt without interest accruing. Compare the transfer fee against what you would actually save in interest.',
    filters: { category: 'balance-transfer', sort: 'intro-apr-length', dir: 'desc' },
  },
];

export function getPreset(slug: string): PresetDef | undefined {
  return PRESETS.find((p) => p.slug === slug);
}
