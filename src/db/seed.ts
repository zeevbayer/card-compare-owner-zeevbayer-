import 'dotenv/config';
import { db } from './index';
import {
  issuers,
  rewardCategories,
  rewardsPrograms,
  benefits,
  cards,
  cardRewardRates,
  topics,
  articles,
  articleRelatedCards,
} from './schema';

async function seed() {
  console.log('Seeding issuers...');
  const issuerRows = await db
    .insert(issuers)
    .values([
      { slug: 'wells-fargo', name: 'Wells Fargo', url: 'https://www.wellsfargo.com' },
      { slug: 'citi', name: 'Citi', url: 'https://www.citi.com' },
      { slug: 'capital-one', name: 'Capital One', url: 'https://www.capitalone.com' },
      {
        slug: 'american-express',
        name: 'American Express',
        url: 'https://www.americanexpress.com',
      },
      { slug: 'chase', name: 'Chase', url: 'https://www.chase.com' },
      { slug: 'discover', name: 'Discover', url: 'https://www.discover.com' },
    ])
    .returning();
  const issuerBySlug = Object.fromEntries(issuerRows.map((i) => [i.slug, i]));

  console.log('Seeding reward categories...');
  const categorySlugs = [
    ['groceries', 'Groceries'],
    ['gas', 'Gas'],
    ['dining', 'Dining'],
    ['travel', 'Travel'],
    ['airline', 'Airline'],
    ['hotel', 'Hotel'],
    ['car-rental', 'Car Rental'],
    ['luxury-travel', 'Luxury Travel'],
    ['home-improvement', 'Home Improvement'],
    ['office-supplies', 'Office Supplies'],
    ['advertising', 'Advertising / PPC Marketing'],
    ['shipping', 'Shipping'],
    ['drugstores', 'Drug Stores'],
    ['amazon', 'Amazon'],
    ['phone-internet', 'Phone & Internet'],
    ['cash-back', 'Cash Back'],
    ['balance-transfer', 'Balance Transfer'],
    ['secured', 'Secured'],
  ] as const;
  const categoryRows = await db
    .insert(rewardCategories)
    .values(categorySlugs.map(([slug, label]) => ({ slug, label })))
    .returning();
  const categoryBySlug = Object.fromEntries(categoryRows.map((c) => [c.slug, c]));

  console.log('Seeding rewards programs...');
  const programRows = await db
    .insert(rewardsPrograms)
    .values([
      { slug: 'chase-ultimate-rewards', label: 'Chase Ultimate Rewards', type: 'bank_points' },
      {
        slug: 'amex-membership-rewards',
        label: 'American Express Membership Rewards',
        type: 'bank_points',
      },
      { slug: 'citi-thankyou', label: 'Citi ThankYou Rewards', type: 'bank_points' },
      { slug: 'capital-one-miles', label: 'Capital One Miles', type: 'bank_points' },
      { slug: 'discover-cashback', label: 'Discover Cashback Match', type: 'cash_back' },
    ])
    .returning();
  const programBySlug = Object.fromEntries(programRows.map((p) => [p.slug, p]));

  console.log('Seeding benefits...');
  const benefitSlugs = [
    ['anniversary-bonus', 'Anniversary bonus'],
    ['waived-annual-fee', 'Waived annual fee (first year or ongoing)'],
    ['rental-car-coverage', 'Rental car coverage'],
    ['status-upgrade', 'Automatic status upgrade'],
    ['cell-phone-protection', 'Cell phone protection'],
    ['companion-certificate', 'Companion certificate'],
    ['extended-warranty', 'Extended warranty'],
    ['checked-baggage', 'Free checked bag'],
    ['international-data', 'International eSIM / data credit'],
    ['free-night-certificate', 'Free night certificate'],
    ['inflight-discount', 'In-flight purchase discount'],
    ['lost-luggage-insurance', 'Lost luggage insurance'],
    ['lounge-access', 'Airport lounge access'],
    ['no-foreign-transaction-fee', 'No foreign transaction fee'],
    ['priority-boarding', 'Priority boarding'],
    ['purchase-protection', 'Purchase protection'],
    ['return-protection', 'Return protection'],
    ['roadside-assistance', 'Roadside assistance'],
    ['travel-accident-insurance', 'Travel accident insurance'],
    ['trip-cancellation-insurance', 'Trip cancellation / interruption insurance'],
    ['trip-delay-insurance', 'Trip delay insurance'],
  ] as const;
  await db.insert(benefits).values(benefitSlugs.map(([slug, label]) => ({ slug, label })));

  console.log('Seeding cards...');
  type SeedCard = {
    slug: string;
    name: string;
    issuer: keyof typeof issuerBySlug;
    program?: keyof typeof programBySlug;
    tier: 'excellent' | 'good' | 'fair' | 'building';
    categories: (keyof typeof categoryBySlug)[];
    overview: string;
  };

  const seedCards: SeedCard[] = [
    {
      slug: 'wells-fargo-active-cash',
      name: 'Wells Fargo Active Cash',
      issuer: 'wells-fargo',
      tier: 'good',
      categories: ['cash-back'],
      overview: 'A flat-rate cash back card from Wells Fargo.',
    },
    {
      slug: 'citi-double-cash',
      name: 'Citi Double Cash',
      issuer: 'citi',
      program: 'citi-thankyou',
      tier: 'good',
      categories: ['cash-back'],
      overview: 'A two-part flat-rate cash back card from Citi.',
    },
    {
      slug: 'capital-one-quicksilver',
      name: 'Capital One Quicksilver',
      issuer: 'capital-one',
      program: 'capital-one-miles',
      tier: 'good',
      categories: ['cash-back'],
      overview: 'A flat-rate cash back card from Capital One.',
    },
    {
      slug: 'blue-cash-everyday',
      name: 'Blue Cash Everyday',
      issuer: 'american-express',
      program: 'amex-membership-rewards',
      tier: 'good',
      categories: ['cash-back', 'groceries', 'gas'],
      overview: 'A category cash back card from American Express geared toward household spending.',
    },
    {
      slug: 'chase-freedom-unlimited',
      name: 'Chase Freedom Unlimited',
      issuer: 'chase',
      program: 'chase-ultimate-rewards',
      tier: 'good',
      categories: ['cash-back', 'dining'],
      overview: 'A flat-rate cash back card from Chase that earns Ultimate Rewards points.',
    },
    {
      slug: 'discover-it-cash-back',
      name: 'Discover it Cash Back',
      issuer: 'discover',
      program: 'discover-cashback',
      tier: 'good',
      categories: ['cash-back', 'groceries', 'gas'],
      overview: 'A rotating-category cash back card from Discover.',
    },
    {
      slug: 'wells-fargo-reflect',
      name: 'Wells Fargo Reflect',
      issuer: 'wells-fargo',
      tier: 'good',
      categories: ['balance-transfer'],
      overview: 'A balance transfer and long intro-APR focused card from Wells Fargo.',
    },
    {
      slug: 'citi-simplicity',
      name: 'Citi Simplicity',
      issuer: 'citi',
      tier: 'good',
      categories: ['balance-transfer'],
      overview: 'A balance transfer focused card from Citi with no late fee or penalty APR by design.',
    },
    {
      slug: 'capital-one-venture-x',
      name: 'Capital One Venture X',
      issuer: 'capital-one',
      program: 'capital-one-miles',
      tier: 'excellent',
      categories: ['travel', 'luxury-travel'],
      overview: 'A premium travel card from Capital One earning transferable miles.',
    },
    {
      slug: 'chase-sapphire-preferred',
      name: 'Chase Sapphire Preferred',
      issuer: 'chase',
      program: 'chase-ultimate-rewards',
      tier: 'good',
      categories: ['travel', 'dining'],
      overview: 'A mid-tier travel card from Chase earning Ultimate Rewards points.',
    },
    {
      slug: 'capital-one-venture',
      name: 'Capital One Venture',
      issuer: 'capital-one',
      program: 'capital-one-miles',
      tier: 'good',
      categories: ['travel'],
      overview: 'A flat-rate travel rewards card from Capital One.',
    },
    {
      slug: 'discover-it-secured',
      name: 'Discover it Secured',
      issuer: 'discover',
      tier: 'building',
      categories: ['secured'],
      overview: 'A secured card from Discover intended for building or rebuilding credit.',
    },
    {
      slug: 'capital-one-platinum-secured',
      name: 'Capital One Platinum Secured',
      issuer: 'capital-one',
      tier: 'building',
      categories: ['secured'],
      overview: 'A secured card from Capital One intended for building or rebuilding credit.',
    },
    {
      slug: 'chase-sapphire-reserve',
      name: 'Chase Sapphire Reserve',
      issuer: 'chase',
      program: 'chase-ultimate-rewards',
      tier: 'excellent',
      categories: ['travel', 'luxury-travel'],
      overview: 'A premium travel card from Chase earning Ultimate Rewards points.',
    },
    {
      slug: 'amex-platinum',
      name: 'Amex Platinum',
      issuer: 'american-express',
      program: 'amex-membership-rewards',
      tier: 'excellent',
      categories: ['travel', 'luxury-travel'],
      overview: 'A premium travel card from American Express earning Membership Rewards points.',
    },
  ];

  const insertedCards = await db
    .insert(cards)
    .values(
      seedCards.map((c) => ({
        slug: c.slug,
        name: c.name,
        issuerId: issuerBySlug[c.issuer].id,
        rewardsProgramId: c.program ? programBySlug[c.program].id : null,
        cardType: c.tier === 'building' ? ('secured' as const) : ('personal' as const),
        creditScoreTier: c.tier,
        overview: c.overview,
        issuerUrl: issuerBySlug[c.issuer].url,
      }))
    )
    .returning();

  console.log('Seeding card <-> reward category links...');
  const rewardRateRows = seedCards.flatMap((c, i) =>
    c.categories.map((catSlug) => ({
      cardId: insertedCards[i].id,
      categoryId: categoryBySlug[catSlug].id,
    }))
  );
  if (rewardRateRows.length) {
    await db.insert(cardRewardRates).values(rewardRateRows);
  }

  console.log('Seeding topics...');
  const topicRows = await db
    .insert(topics)
    .values([
      { slug: 'credit', label: 'Credit' },
      { slug: 'credit-card-info', label: 'Credit Card Info' },
      { slug: 'identity-theft', label: 'Identity Theft' },
      { slug: 'improving-credit', label: 'Improving Credit' },
      { slug: 'debt', label: 'Debt' },
      { slug: 'balance-transfers', label: 'Balance Transfers' },
    ])
    .returning();
  const topicBySlug = Object.fromEntries(topicRows.map((t) => [t.slug, t]));

  console.log('Seeding articles...');
  const articleSeed = [
    {
      slug: 'what-deferred-interest-actually-means',
      title: 'What Deferred Interest Actually Means (And How to Spot It)',
      description:
        "'0% intro APR' and 'no interest if paid in full' sound the same. They aren't. Here's how deferred interest works, and the two phrases that tell you which one you're looking at.",
      topic: 'credit-card-info' as const,
      publishDate: '2026-07-24',
      lastUpdated: '2026-07-24',
      relatedCards: ['wells-fargo-reflect', 'citi-simplicity'],
      body: DEFERRED_INTEREST_BODY,
    },
    {
      slug: 'why-store-credit-cards-cost-more',
      title: 'Why Store Credit Cards Cost More Than You Think',
      description:
        'Store credit cards approve almost anyone and dangle a discount at checkout. The APR attached to that discount is usually well above what a general-purpose card would charge you.',
      topic: 'credit-card-info' as const,
      publishDate: '2026-07-24',
      lastUpdated: '2026-07-24',
      relatedCards: [],
      body: STORE_CARDS_BODY,
    },
    {
      slug: 'how-to-read-a-rate-table',
      title: "How to Read a Credit Card's Rate Table",
      description:
        'The Schumer box is the one part of a credit card application designed to be comparable. A walkthrough of what each line means and which ones actually matter.',
      topic: 'credit-card-info' as const,
      publishDate: '2026-07-24',
      lastUpdated: '2026-07-24',
      relatedCards: [],
      body: RATE_TABLE_BODY,
    },
  ];

  const insertedArticles = await db
    .insert(articles)
    .values(
      articleSeed.map((a) => ({
        slug: a.slug,
        title: a.title,
        description: a.description,
        body: a.body,
        topicId: topicBySlug[a.topic].id,
        publishDate: a.publishDate,
        lastUpdated: a.lastUpdated,
      }))
    )
    .returning();

  const cardBySlug = Object.fromEntries(insertedCards.map((c) => [c.slug, c]));
  const relatedRows = articleSeed.flatMap((a, i) =>
    a.relatedCards.map((cardSlug) => ({
      articleId: insertedArticles[i].id,
      cardId: cardBySlug[cardSlug].id,
    }))
  );
  if (relatedRows.length) {
    await db.insert(articleRelatedCards).values(relatedRows);
  }

  console.log('Seed complete.');
  process.exit(0);
}

const DEFERRED_INTEREST_BODY = `Two credit card offers can both advertise "0% for 24 months" and mean completely different things about what happens if you don't pay the balance off in time.

## The two structures

**True 0% intro APR.** During the promotional period, no interest accrues. If any balance is left when the period ends, interest starts accruing from that point forward, on the remaining balance only.

**Deferred interest.** During the promotional period, interest is still being calculated in the background. If you pay the entire original balance in full by the deadline, that interest is waived. But if any balance is left unpaid on the last day, the issuer charges interest retroactively on the entire original purchase amount, back to day one.

## The tell

- **"0% intro APR for X months"** -> true promotional rate.
- **"No interest if paid in full within X months"** -> deferred interest.

[VERIFY: source URL — confirm current CFPB or issuer definitions distinguish these phrasings the same way]

Roughly 80% of store credit cards that offer a 0%-style promotional rate use the deferred interest structure. [VERIFY: source URL — WalletHub store card tracking data]

## Worked example

A $2,000 purchase, 24-month "no interest if paid in full" promotion, $50 left on the deadline. Under a true intro APR, you'd owe interest going forward only on that $50. Because it's deferred interest, the issuer calculates interest on the full $2,000, retroactive across the entire 24 months — often several hundred dollars. [VERIFY: source URL — confirm compounding assumptions used for this estimate]
`;

const STORE_CARDS_BODY = `The pitch at checkout is simple: apply for the store card, save 15-20% on today's purchase. What's rarely mentioned is the interest rate attached to the card if you carry a balance afterward.

## The rate gap

Average retail card APR runs above 30%, versus roughly 21.5% for general-purpose cards. About 90% of retail cards carry a maximum APR above 30%, compared with 38% of general-purpose cards. [VERIFY: source URL — CFPB Issue Spotlight on retail credit cards]

## Worked example

A $200 purchase, 15% off ($30 saved). Carrying the remaining $170 at a 30% APR wipes out the $30 discount in roughly 13 months of carrying a balance. [VERIFY: source URL — confirm payoff schedule assumptions]

## The practical rule

A store card can make sense if you pay in full every month. The moment you expect to carry a balance, run the interest cost against the discount before deciding it's worth it.
`;

const RATE_TABLE_BODY = `Federal law requires issuers to disclose key rates and fees in a standardized table, the "Schumer box." [VERIFY: source URL — confirm current Truth in Lending Act / Regulation Z disclosure requirements]

## Purchase APR
The rate charged on purchases if you carry a balance past the due date.

## Penalty APR
A higher rate triggered by events like a late payment, which can apply to your entire balance.

## Balance transfer fee
A percentage (commonly 3-5%) charged on transferred balances, on top of any interest.

## Cash advance terms
Usually a higher APR than purchases, with no grace period, plus a separate fee.

## What triggers a penalty rate
Usually one or more late payments within a defined window — read this section before you need it, not after.
`;

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
