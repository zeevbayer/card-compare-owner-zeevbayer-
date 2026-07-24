import 'dotenv/config';
import { db } from './index';
import { cards, cardRewardRates, cardCredits, cardBenefits, rewardCategories, benefits } from './schema';
import { eq, and } from 'drizzle-orm';

const VERIFIED_DATE = '2026-07-24';

interface RewardRateInput {
  category: string;
  ratePct: number;
  notes: string;
}

interface CreditInput {
  label: string;
  valueAmount: number | null;
  frequency?: string;
  redemptionConditions?: string;
}

interface BenefitInput {
  slug: string;
  details?: string;
}

interface CardUpdate {
  slug: string;
  annualFee: number | null;
  purchaseAprMin: number | null;
  purchaseAprMax: number | null;
  introApr: number | null;
  introAprMonths: number | null;
  balanceTransferFeePct: number | null;
  foreignTransactionFeePct: number | null;
  welcomeOfferDescription: string | null;
  welcomeOfferSpendRequirement: number | null;
  welcomeOfferWindow: string | null;
  overview: string;
  creditScoreTier?: 'excellent' | 'good' | 'fair' | 'building';
  rewardRates?: RewardRateInput[];
  credits?: CreditInput[];
  benefits?: BenefitInput[];
}

const updates: CardUpdate[] = [
  {
    slug: 'wells-fargo-active-cash',
    annualFee: 0,
    purchaseAprMin: 18.49,
    purchaseAprMax: 28.49,
    introApr: 0,
    introAprMonths: 12,
    balanceTransferFeePct: 5,
    foreignTransactionFeePct: 3,
    welcomeOfferDescription: '$200 cash rewards bonus',
    welcomeOfferSpendRequirement: 500,
    welcomeOfferWindow: '3 months',
    overview:
      'A flat-rate cash back card from Wells Fargo. 0% intro APR for 12 months on purchases and qualifying balance transfers. Balance transfer fee is 3% (min $5) if completed within the first 120 days, then 5% (min $5) after that.',
    rewardRates: [{ category: 'cash-back', ratePct: 2, notes: '2% cash back on all purchases' }],
  },
  {
    slug: 'citi-double-cash',
    annualFee: 0,
    purchaseAprMin: 17.49,
    purchaseAprMax: 27.49,
    introApr: 0,
    introAprMonths: 18,
    balanceTransferFeePct: 5,
    foreignTransactionFeePct: 3,
    welcomeOfferDescription: null,
    welcomeOfferSpendRequirement: null,
    welcomeOfferWindow: null,
    overview:
      'A two-part flat-rate cash back card from Citi. The 0% intro APR (18 months) applies to balance transfers only, not purchases — transfers must be completed within 4 months of account opening for the intro rate, with a 3% fee (min $5) during that window, 5% (min $5) after. Penalty APR up to 29.99%. Welcome offer not disclosed on the official page at time of verification.',
    rewardRates: [
      { category: 'cash-back', ratePct: 2, notes: '1% when you buy + 1% as you pay = 2% total' },
      { category: 'hotel', ratePct: 3, notes: '3% cash back via Citi Travel' },
      { category: 'car-rental', ratePct: 3, notes: '3% cash back via Citi Travel' },
    ],
  },
  {
    slug: 'capital-one-quicksilver',
    annualFee: 0,
    purchaseAprMin: null,
    purchaseAprMax: null,
    introApr: null,
    introAprMonths: null,
    balanceTransferFeePct: null,
    foreignTransactionFeePct: null,
    welcomeOfferDescription: '$200 cash bonus',
    welcomeOfferSpendRequirement: 500,
    welcomeOfferWindow: '3 months',
    overview:
      'A flat-rate cash back card from Capital One. Advertises a "low intro APR" for 15 months, but the exact rate is not disclosed on the official page — treat as unconfirmed. Purchase APR sits behind a rates-and-disclosures modal that could not be verified directly.',
    creditScoreTier: 'excellent',
    rewardRates: [
      { category: 'cash-back', ratePct: 1.5, notes: '1.5% cash back on every purchase' },
    ],
  },
  {
    slug: 'blue-cash-everyday',
    annualFee: 0,
    purchaseAprMin: null,
    purchaseAprMax: null,
    introApr: null,
    introAprMonths: null,
    balanceTransferFeePct: 3,
    foreignTransactionFeePct: 2.7,
    welcomeOfferDescription: null,
    welcomeOfferSpendRequirement: null,
    welcomeOfferWindow: null,
    overview:
      "Amex's card page doesn't publish a marketed purchase APR range; the official Cardmember Agreement (effective 12/31/2025) lists it as a variable rate of Prime Rate + 12.74% to Prime Rate + 21.74%, which we have not converted to a fixed percentage. Balance transfer fee is $5 or 3% of the transfer, whichever is greater. No welcome offer appeared on the fetched official page at time of verification. Also includes up to a $7 monthly statement credit toward an eligible Disney streaming subscription.",
    rewardRates: [
      { category: 'groceries', ratePct: 3, notes: '3% cash back (up to $6,000/yr in purchases, then 1%)' },
      { category: 'gas', ratePct: 3, notes: '3% cash back (up to $6,000/yr, then 1%)' },
      { category: 'cash-back', ratePct: 1, notes: '1% on other purchases (and after category caps)' },
    ],
  },
  {
    slug: 'chase-freedom-unlimited',
    annualFee: 0,
    purchaseAprMin: 18.24,
    purchaseAprMax: 27.74,
    introApr: 0,
    introAprMonths: 15,
    balanceTransferFeePct: null,
    foreignTransactionFeePct: null,
    welcomeOfferDescription: '$200 bonus',
    welcomeOfferSpendRequirement: 500,
    welcomeOfferWindow: '3 months',
    overview:
      "A flat-rate cash back card from Chase that earns Ultimate Rewards points. 0% intro APR for 15 months on purchases and balance transfers. Also earns an additional 0.5% (2% total) on Lyft rides through 9/30/2027. Balance transfer fee and foreign transaction fee sit on Chase's Pricing & Terms page, which blocks automated access — not independently verified.",
    rewardRates: [
      { category: 'travel', ratePct: 5, notes: '5% cash back via Chase Travel only' },
      { category: 'dining', ratePct: 3, notes: '3% cash back at restaurants, including takeout and eligible delivery' },
      { category: 'drugstores', ratePct: 3, notes: '3% cash back at drugstores' },
      { category: 'cash-back', ratePct: 1.5, notes: '1.5% cash back on all other purchases' },
    ],
  },
  {
    slug: 'discover-it-cash-back',
    annualFee: 0,
    purchaseAprMin: 17.49,
    purchaseAprMax: 26.49,
    introApr: 0,
    introAprMonths: 15,
    balanceTransferFeePct: null,
    foreignTransactionFeePct: null,
    welcomeOfferDescription: 'Cashback Match: all cash back earned in your first year, matched dollar-for-dollar, automatically',
    welcomeOfferSpendRequirement: null,
    welcomeOfferWindow: 'first year',
    overview:
      '0% intro APR for 15 months on purchases and balance transfers. Earns 5% cash back in rotating categories each quarter (activation required, quarterly cap not disclosed on the official page) and 1% on everything else. Balance transfer fee could not be confirmed from a card-specific source.',
    rewardRates: [
      { category: 'cash-back', ratePct: 1, notes: '1% on all purchases outside the rotating 5% categories (activation required)' },
    ],
  },
  {
    slug: 'wells-fargo-reflect',
    annualFee: 0,
    purchaseAprMin: 17.49,
    purchaseAprMax: 28.24,
    introApr: 0,
    introAprMonths: 21,
    balanceTransferFeePct: 5,
    foreignTransactionFeePct: 3,
    welcomeOfferDescription: null,
    welcomeOfferSpendRequirement: null,
    welcomeOfferWindow: null,
    overview:
      'No rewards program — this card is built entirely around its intro APR length, one of the longer 0% offers available: 21 months on purchases and qualifying balance transfers (transfers must be made within 120 days to qualify).',
  },
  {
    slug: 'citi-simplicity',
    annualFee: 0,
    purchaseAprMin: null,
    purchaseAprMax: null,
    introApr: null,
    introAprMonths: null,
    balanceTransferFeePct: null,
    foreignTransactionFeePct: null,
    welcomeOfferDescription: null,
    welcomeOfferSpendRequirement: null,
    welcomeOfferWindow: null,
    overview:
      'No rewards program. Advertises an intro APR on both purchases and balance transfers, but the rate and duration render as blank placeholders on every official page we could reach — not confirmed. Recommended credit: good to excellent.',
  },
  {
    slug: 'capital-one-venture-x',
    annualFee: 395,
    purchaseAprMin: 19.49,
    purchaseAprMax: 28.49,
    introApr: null,
    introAprMonths: null,
    balanceTransferFeePct: null,
    foreignTransactionFeePct: null,
    welcomeOfferDescription: '75,000 bonus miles',
    welcomeOfferSpendRequirement: 4000,
    welcomeOfferWindow: '3 months',
    overview:
      'A premium travel card from Capital One earning transferable miles. Includes a $300 annual Capital One Travel credit, a 10,000-mile anniversary bonus, and lounge access (Capital One Lounge and Landing locations, plus 1,300+ Priority Pass lounges worldwide — enrollment required).',
    rewardRates: [
      { category: 'travel', ratePct: 2, notes: '2X miles per dollar on every purchase' },
    ],
    credits: [
      { label: 'Capital One Travel credit', valueAmount: 300, frequency: 'annual' },
      { label: 'Anniversary bonus', valueAmount: null, redemptionConditions: '10,000 miles, awarded each account anniversary' },
    ],
    benefits: [
      { slug: 'lounge-access', details: 'Capital One Lounge and Landing locations; 1,300+ Priority Pass lounges worldwide (enrollment required)' },
    ],
  },
  {
    slug: 'chase-sapphire-preferred',
    annualFee: 95,
    purchaseAprMin: 19.24,
    purchaseAprMax: 27.49,
    introApr: null,
    introAprMonths: null,
    balanceTransferFeePct: null,
    foreignTransactionFeePct: 0,
    welcomeOfferDescription: '100,000 points (limited-time elevated offer; standard offer shown as 75,000)',
    welcomeOfferSpendRequirement: 5000,
    welcomeOfferWindow: '3 months',
    overview:
      'A mid-tier travel card from Chase earning Ultimate Rewards points. No foreign transaction fees. Balance transfer fee sits on a Pricing & Terms page blocked to automated access — not independently verified.',
    rewardRates: [
      { category: 'travel', ratePct: 5, notes: '5X points via Chase Travel, 2X on all other travel purchases' },
      { category: 'dining', ratePct: 3, notes: '3X points at dining worldwide' },
      { category: 'gas', ratePct: 3, notes: '3X points at gas stations and EV charging (top brands)' },
      { category: 'groceries', ratePct: 3, notes: '3X points on online grocery purchases (top brands)' },
    ],
  },
  {
    slug: 'capital-one-venture',
    annualFee: 95,
    purchaseAprMin: 19.49,
    purchaseAprMax: 28.49,
    introApr: null,
    introAprMonths: null,
    balanceTransferFeePct: null,
    foreignTransactionFeePct: 0,
    welcomeOfferDescription: '75,000 bonus miles',
    welcomeOfferSpendRequirement: 4000,
    welcomeOfferWindow: '3 months',
    overview: 'A flat-rate travel rewards card from Capital One. No foreign transaction fees.',
    creditScoreTier: 'excellent',
    rewardRates: [
      { category: 'travel', ratePct: 2, notes: '2X miles per dollar on every purchase' },
      { category: 'hotel', ratePct: 5, notes: '5X miles on hotels booked via Capital One Travel' },
      { category: 'car-rental', ratePct: 5, notes: '5X miles on rental cars booked via Capital One Travel' },
    ],
  },
  {
    slug: 'discover-it-secured',
    annualFee: 0,
    purchaseAprMin: 27.24,
    purchaseAprMax: 27.24,
    introApr: null,
    introAprMonths: null,
    balanceTransferFeePct: 5,
    foreignTransactionFeePct: null,
    welcomeOfferDescription: 'Cashback Match: all cash back earned in your first year, matched dollar-for-dollar, automatically',
    welcomeOfferSpendRequirement: null,
    welcomeOfferWindow: 'first year',
    overview:
      'A secured card from Discover intended for building or rebuilding credit — no credit score required to apply. Refundable deposit as low as $49 (deposit is $49, $99, or $200 depending on creditworthiness); minimum credit line is $200. Earns 5% cash back in rotating categories each quarter (activation required) and 1% on everything else — unusual for a secured card.',
    rewardRates: [
      { category: 'cash-back', ratePct: 1, notes: '1% on all purchases outside the rotating 5% categories (activation required)' },
    ],
  },
  {
    slug: 'capital-one-platinum-secured',
    annualFee: 0,
    purchaseAprMin: null,
    purchaseAprMax: null,
    introApr: null,
    introAprMonths: null,
    balanceTransferFeePct: null,
    foreignTransactionFeePct: null,
    welcomeOfferDescription: null,
    welcomeOfferSpendRequirement: null,
    welcomeOfferWindow: null,
    overview:
      'A secured card from Capital One intended for building or rebuilding credit. Deposit is $49, $99, or $200 depending on creditworthiness and opens a credit line of at least $200; the deposit can later be increased up to a $1,000 maximum. Full required deposit is due within 35 days of approval. No rewards program. Purchase APR sits behind a rates-and-disclosures modal that could not be verified directly.',
  },
  {
    slug: 'chase-sapphire-reserve',
    annualFee: 795,
    purchaseAprMin: 19.49,
    purchaseAprMax: 27.99,
    introApr: null,
    introAprMonths: null,
    balanceTransferFeePct: null,
    foreignTransactionFeePct: 0,
    welcomeOfferDescription: '100,000 points',
    welcomeOfferSpendRequirement: 6000,
    welcomeOfferWindow: '3 months',
    overview:
      'A premium travel card from Chase earning Ultimate Rewards points. $795 annual fee ($195 for each authorized user). No foreign transaction fees. Includes up to $300 in statement credits for travel purchases each account anniversary year, plus lounge access (Chase Sapphire Lounge by The Club; 1,300+ Priority Pass airport lounges with up to two guests).',
    rewardRates: [
      { category: 'travel', ratePct: 8, notes: '8X points via Chase Travel, including The Edit' },
      { category: 'airline', ratePct: 4, notes: '4X points on flights booked direct' },
      { category: 'hotel', ratePct: 4, notes: '4X points on hotels booked direct' },
      { category: 'dining', ratePct: 3, notes: '3X points at dining worldwide' },
    ],
    credits: [{ label: 'Annual travel credit', valueAmount: 300, frequency: 'annual' }],
    benefits: [
      { slug: 'lounge-access', details: 'Chase Sapphire Lounge by The Club; 1,300+ Priority Pass airport lounges, up to two guests' },
    ],
  },
  {
    slug: 'amex-platinum',
    annualFee: 895,
    purchaseAprMin: null,
    purchaseAprMax: null,
    introApr: null,
    introAprMonths: null,
    balanceTransferFeePct: null,
    foreignTransactionFeePct: 0,
    welcomeOfferDescription: null,
    welcomeOfferSpendRequirement: null,
    welcomeOfferWindow: null,
    overview:
      "A premium travel card from American Express earning Membership Rewards points. $895 annual fee for the Basic Card, $195 for each Additional Card, no fee for Companion Platinum Cards. No foreign transaction fees. Amex's card page doesn't publish a marketed purchase APR range; the official Card Member Agreement (effective 3/31/2026) lists Pay Over Time APR as a variable rate of Prime Rate + 12.74% to Prime Rate + 21.74%, which we have not converted to a fixed percentage. Welcome offer is personalized by Amex and not visible to an automated check — not disclosed here. Value is concentrated in its statement credits rather than a flat earn rate; see Credits below.",
    rewardRates: [
      { category: 'airline', ratePct: 5, notes: '5X Membership Rewards points on flights booked directly with airlines or via Amex Travel (up to $500,000/yr in these purchases)' },
      { category: 'hotel', ratePct: 5, notes: '5X points on prepaid hotels booked via Amex Travel' },
    ],
    credits: [
      { label: 'Global Lounge Collection', valueAmount: null, redemptionConditions: 'Value stated by Amex as "$850+", a bundled valuation across multiple lounge programs — not a single fixed credit' },
      { label: 'Hotel Credit', valueAmount: 600, frequency: 'annual' },
      { label: 'Fine Hotels + Resorts', valueAmount: null, redemptionConditions: 'Value stated by Amex as "$550+" — not a single fixed credit' },
      { label: 'Resy Credit', valueAmount: 400, frequency: 'annual' },
      { label: 'Digital Entertainment Credit', valueAmount: 300, frequency: 'annual' },
      { label: 'lululemon Credit', valueAmount: 300, frequency: 'annual' },
      { label: 'Equinox Credit', valueAmount: 300, frequency: 'annual' },
      { label: 'Uber Cash', valueAmount: 200, frequency: 'annual' },
      { label: 'Airline Fee Credit', valueAmount: 200, frequency: 'annual' },
      { label: 'Oura Ring Credit', valueAmount: 200, frequency: 'annual' },
      { label: 'CLEAR+ Credit', valueAmount: 219, frequency: 'annual' },
      { label: 'Walmart+ Credit', valueAmount: 155, frequency: 'annual' },
      { label: 'Uber One Credit', valueAmount: 120, frequency: 'annual' },
    ],
  },
];

async function run() {
  for (const u of updates) {
    const card = await db.query.cards.findFirst({ where: eq(cards.slug, u.slug) });
    if (!card) {
      console.warn(`Skipping unknown card slug: ${u.slug}`);
      continue;
    }

    await db
      .update(cards)
      .set({
        annualFee: u.annualFee !== null ? String(u.annualFee) : null,
        purchaseAprMin: u.purchaseAprMin !== null ? String(u.purchaseAprMin) : null,
        purchaseAprMax: u.purchaseAprMax !== null ? String(u.purchaseAprMax) : null,
        introApr: u.introApr !== null ? String(u.introApr) : null,
        introAprMonths: u.introAprMonths,
        balanceTransferFeePct: u.balanceTransferFeePct !== null ? String(u.balanceTransferFeePct) : null,
        foreignTransactionFeePct:
          u.foreignTransactionFeePct !== null ? String(u.foreignTransactionFeePct) : null,
        welcomeOfferDescription: u.welcomeOfferDescription,
        welcomeOfferSpendRequirement:
          u.welcomeOfferSpendRequirement !== null ? String(u.welcomeOfferSpendRequirement) : null,
        welcomeOfferWindow: u.welcomeOfferWindow,
        overview: u.overview,
        creditScoreTier: u.creditScoreTier ?? card.creditScoreTier,
        lastVerified: VERIFIED_DATE,
        updatedAt: new Date(),
      })
      .where(eq(cards.id, card.id));

    for (const rr of u.rewardRates ?? []) {
      const category = await db.query.rewardCategories.findFirst({
        where: eq(rewardCategories.slug, rr.category),
      });
      if (!category) {
        console.warn(`Unknown category ${rr.category} for ${u.slug}`);
        continue;
      }
      const existing = await db.query.cardRewardRates.findFirst({
        where: and(eq(cardRewardRates.cardId, card.id), eq(cardRewardRates.categoryId, category.id)),
      });
      if (existing) {
        await db
          .update(cardRewardRates)
          .set({ ratePct: String(rr.ratePct), notes: rr.notes })
          .where(and(eq(cardRewardRates.cardId, card.id), eq(cardRewardRates.categoryId, category.id)));
      } else {
        await db.insert(cardRewardRates).values({
          cardId: card.id,
          categoryId: category.id,
          ratePct: String(rr.ratePct),
          notes: rr.notes,
        });
      }
    }

    for (const c of u.credits ?? []) {
      const existingCredit = await db.query.cardCredits.findFirst({
        where: (cc, { eq: eqOp, and: andOp }) => andOp(eqOp(cc.cardId, card.id), eqOp(cc.label, c.label)),
      });
      if (existingCredit) continue;
      await db.insert(cardCredits).values({
        cardId: card.id,
        label: c.label,
        valueAmount: c.valueAmount !== null ? String(c.valueAmount) : null,
        frequency: c.frequency ?? null,
        redemptionConditions: c.redemptionConditions ?? null,
      });
    }

    for (const b of u.benefits ?? []) {
      const benefit = await db.query.benefits.findFirst({ where: eq(benefits.slug, b.slug) });
      if (!benefit) {
        console.warn(`Unknown benefit ${b.slug} for ${u.slug}`);
        continue;
      }
      const existing = await db.query.cardBenefits.findFirst({
        where: and(eq(cardBenefits.cardId, card.id), eq(cardBenefits.benefitId, benefit.id)),
      });
      if (!existing) {
        await db.insert(cardBenefits).values({ cardId: card.id, benefitId: benefit.id, details: b.details ?? null });
      }
    }

    console.log(`Updated ${u.slug}`);
  }

  console.log('Done.');
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
