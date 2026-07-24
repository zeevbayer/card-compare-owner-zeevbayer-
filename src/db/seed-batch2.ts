import 'dotenv/config';
import { db } from './index';
import { articles, topics } from './schema';
import { eq } from 'drizzle-orm';

async function topicId(slug: string): Promise<number> {
  const topic = await db.query.topics.findFirst({ where: eq(topics.slug, slug) });
  if (!topic) throw new Error(`Topic not found: ${slug}. Run the main seed first.`);
  return topic.id;
}

async function seedBatch2() {
  const [improvingCredit, balanceTransfers, creditCardInfo, credit] = await Promise.all([
    topicId('improving-credit'),
    topicId('balance-transfers'),
    topicId('credit-card-info'),
    topicId('credit'),
  ]);

  const newArticles = [
    {
      slug: 'how-secured-cards-actually-build-credit',
      title: 'How Secured Cards Actually Build Credit',
      description:
        'A secured card looks almost identical to a normal card and reports the same way to the bureaus. The difference is entirely in how the credit limit gets set, and what that means for your utilization.',
      topicId: improvingCredit,
      body: SECURED_CARDS_BODY,
    },
    {
      slug: 'balance-transfer-cards-the-math-nobody-shows-you',
      title: 'Balance Transfer Cards: The Math Nobody Shows You',
      description:
        'A balance transfer moves debt to a lower rate, but it also charges a fee up front. Here is the actual comparison to run before you decide it is worth it.',
      topicId: balanceTransfers,
      body: BALANCE_TRANSFER_BODY,
    },
    {
      slug: 'credit-utilization-the-number-that-moves-your-score-fastest',
      title: 'Credit Utilization: The Number That Moves Your Score Fastest',
      description:
        'Payment history builds slowly. Utilization is recalculated with your balance and can move a score within a single billing cycle — here is how it actually works.',
      topicId: improvingCredit,
      body: UTILIZATION_BODY,
    },
    {
      slug: 'cash-back-vs-points-which-is-actually-worth-more',
      title: 'Cash Back vs. Points: Which Is Actually Worth More',
      description:
        'Cash back has a fixed, guaranteed value. Points do not — their worth depends entirely on how you redeem them. Here is how to compare the two honestly.',
      topicId: creditCardInfo,
      body: CASH_BACK_VS_POINTS_BODY,
    },
    {
      slug: 'what-a-hard-pull-actually-costs-your-credit-score',
      title: 'What a Hard Pull Actually Costs Your Credit Score',
      description:
        'A credit card application triggers a hard inquiry. Here is what it typically costs, how long it lasts, and when the bigger risk is a pattern rather than a single application.',
      topicId: credit,
      body: HARD_PULL_BODY,
    },
  ];

  const today = new Date().toISOString().slice(0, 10);

  await db.insert(articles).values(
    newArticles.map((a) => ({
      slug: a.slug,
      title: a.title,
      description: a.description,
      body: a.body,
      topicId: a.topicId,
      publishDate: today,
      lastUpdated: today,
    }))
  );

  console.log(`Seeded ${newArticles.length} articles.`);
  process.exit(0);
}

const SECURED_CARDS_BODY = `A secured card looks almost identical to a normal credit card, and it reports to the credit bureaus the same way a normal card does. The difference is entirely in how the credit limit is set.

## How it works

You put down a refundable cash deposit — commonly $49 to $200 to open the account, sometimes more if you want a higher limit — and the issuer sets your credit limit at or near that deposit amount. If you stop paying, the deposit covers what you owe. That's the entire reason issuers approve applicants a normal unsecured card wouldn't: the collateral removes the credit risk that gets thin-file applicants denied everywhere else.

Everything else works like a standard card. You get a statement every month, you have a due date, you carry a balance if you don't pay in full, and interest accrues on that balance if you do. The deposit is not spent — it's held, and used purely to set your limit and back the account.

## What actually moves your score

Two mechanics matter more than anything else on a secured card:

**Payment history.** On-time payments, reported monthly, are the single largest input into most credit scoring models. A secured card reporting a clean payment history for six to twelve months is doing real, measurable work.

**Credit utilization.** This is your balance divided by your limit, and it's usually the second-largest scoring factor. Because secured card limits are often small — a $200 deposit might mean a $200 limit — a single unremarkable purchase can push utilization to 50% or higher. Staying under roughly 30% utilization (and ideally much lower) matters more on a secured card than it would on a card with a $5,000 limit. [VERIFY: source URL — confirm current utilization guidance from a credit bureau or FICO]

## The graduation path

Many secured cards are explicitly designed as a bridge: some issuers review the account after a period of on-time payments (commonly reviewed around the six-month mark, though this varies by issuer) and, if the history is clean, refund the deposit and convert the account to an unsecured card automatically. Others require you to apply for a new unsecured card and close the secured one yourself. Check which model a specific card uses before assuming your deposit comes back automatically — the mechanism is issuer-specific, not universal. [VERIFY: source URL — confirm graduation timelines per issuer at time of publishing]

## What a secured card won't do

It won't fix a history of missed payments already on your report — those age off on their own timeline regardless of what you do next. It also won't move your score quickly; credit history takes months to build, not weeks. A secured card is a mechanism for building a track record, not a shortcut around one.

## The practical rule

Use it for a small number of recurring purchases you'd make anyway, pay the statement in full every month, and don't chase a higher limit by spending more — the deposit-to-limit ratio is the point, not an obstacle to work around.
`;

const BALANCE_TRANSFER_BODY = `A balance transfer card moves debt from one card to another, usually at a temporary low or 0% rate. The pitch is straightforward: stop paying interest while you pay down the principal. The part that's easy to skip past is the fee charged to make that move in the first place.

## The two numbers that decide whether it's worth it

**The transfer fee.** Almost every balance transfer card charges a fee to move a balance over, commonly in the 3%–5% range of the amount transferred, charged once, up front. This fee is separate from interest and applies even during the 0% promotional period.

**The interest you're actually avoiding.** This is what you're comparing the fee against — the interest you would have paid on the original card if you hadn't moved the balance.

## Worked example

Say you're carrying a $5,000 balance on a card charging 24% APR, and you move it to a card offering 0% for 15 months with a 3% transfer fee.

- Transfer fee: 3% of $5,000 = $150, charged immediately.
- Interest avoided: roughly what $5,000 at 24% APR would have cost over the same period if left on the original card — this runs well into four figures over 15 months of carrying that balance. [VERIFY: source URL — confirm compounding assumptions for this estimate before publishing exact dollar figures]

The fee is real money paid on day one. It only makes sense if what you're avoiding in interest is larger — and with a meaningful balance and a double-digit original APR, it usually is, sometimes by a wide margin.

## Where the math stops working

**Small balances.** A $150 fee on a $5,000 transfer is 3%. That same $150 on a $500 transfer is 30% of the amount moved — at that scale, the interest saved may not clear the fee.

**Short promotional windows relative to your payoff time.** If you can't pay off the balance before the 0% period ends, whatever's left starts accruing interest at the card's regular ongoing APR — which is often comparable to or higher than what you started with. A balance transfer only pays off if you have a realistic plan to clear it inside the promotional window.

**Stacking new charges on the transferred balance.** Some cards apply payments to the lowest-APR balance first, meaning new purchases at a higher ongoing rate can sit accruing interest while your 0% transferred balance gets paid down first. Check how a specific card allocates payments before assuming a $0 first month means $0 total interest.

## The practical rule

Do the fee-versus-interest comparison with real numbers before applying, not after — and only transfer a balance you have an actual payoff plan for inside the promotional window, not just a lower rate you're hoping to get around to using.
`;

const UTILIZATION_BODY = `Payment history carries the most weight in most credit scoring models, but it moves slowly — a year of on-time payments builds a track record a single month can't replicate. Utilization is different: it's recalculated with your balance, and it can shift a score meaningfully within a single billing cycle.

## What it actually is

Utilization is your card balance divided by your credit limit, expressed as a percentage. A $600 balance on a $2,000 limit is 30% utilization. It's calculated per card and also in aggregate across every revolving account you have.

## Why it moves fast

Most other scoring factors — length of credit history, total accounts, hard inquiries — change gradually or are largely outside your control month to month. Utilization is a snapshot of whatever your statement balance happens to be on the day your issuer reports to the bureaus. Pay a balance down before that reporting date and utilization drops immediately; let a balance climb and it rises just as fast.

## The commonly cited threshold

A widely cited guideline is to keep utilization under 30%, with lower being better and very low or near-0% utilization sometimes scoring worse than a small, clearly-paid balance. [VERIFY: source URL — confirm current FICO/VantageScore guidance and whether 0% utilization is scored differently from low single digits] Treat 30% as a rough ceiling, not a target to aim for — the lower you can comfortably keep it, generally the better.

## The trap with small limits

Utilization is brutal on cards with small limits. A single $150 purchase on a card with a $500 limit is already 30% utilization — a level that might take a much larger purchase to reach on a card with a $10,000 limit. This is exactly why utilization tends to matter more, not less, on starter and secured cards, where limits start small.

## Two things that catch people off guard

**Paying in full doesn't always mean 0% reported.** Many issuers report the statement balance on your statement date, not your balance on payment due date. Paying in full every month can still show a nonzero utilization if a balance existed when the statement cut.

**Closing a card raises utilization on the accounts left.** Closing a card removes its limit from your total available credit. If you're carrying balances elsewhere, that same debt is now measured against a smaller total limit — utilization can rise even though nothing about your spending changed.

## The practical rule

If you're planning around a specific score — before a mortgage application, for instance — pay down balances before your statement closing date, not just before the due date, and think twice before closing a card with a long history and no annual fee.
`;

const CASH_BACK_VS_POINTS_BODY = `Both are rewards. Only one of them has a fixed, guaranteed value the moment you earn it.

## The core difference

Cash back is worth exactly what it says. 2% cash back on a $100 purchase is $2, redeemable as statement credit, direct deposit, or a check, with no interpretation required.

Points and miles don't have a fixed dollar value — their worth depends entirely on how you redeem them. The same stash of points can be worth very different amounts depending on whether you redeem for a statement credit, a plain economy flight, or a transfer to an airline or hotel partner during a good award availability window.

## Why points can be worth more

Card issuers often set a baseline redemption value for statement credit or basic travel booking — commonly somewhere in the 1-cent-per-point range, sometimes with a modest bump when redeemed through the issuer's own travel portal. Where points pull ahead of cash back is in transfer partnerships: moving points to an airline or hotel program and redeeming for a premium cabin seat or a high-value hotel night can produce a per-point value well above the baseline rate. [VERIFY: source URL — confirm current baseline redemption rates and representative transfer-partner values before publishing specific cent-per-point figures]

## Why that upside is conditional, not guaranteed

That higher value depends on: having a transfer partner that fits the trip you actually want to take, award availability existing on the dates you need, and being willing to do the redemption research instead of taking the path of least resistance. None of that is guaranteed at the moment you earn the point. Redeem the same points for a statement credit or a random flight at low season and the value can land close to — or below — a flat cash back rate.

## A simple way to decide

Ask honestly: will you actually do the redemption research, or will the points sit until you cash them out the easy way? If it's the former and you have flexible travel plans, a well-chosen points program can out-earn a flat cash back card. If it's the latter, a flat 1.5%–2% cash back card is a more honest estimate of what you'll actually get — because it's not an estimate, it's the definition.

## The practical rule

Don't compare a points program's best-case redemption value to cash back's guaranteed value — that's comparing a ceiling to a floor. Compare cash back's guaranteed rate to the redemption value you'd realistically get on your actual travel habits, not the one in the marketing copy.
`;

const HARD_PULL_BODY = `Every credit card application triggers a hard inquiry — a recorded check of your credit report that's visible to future lenders. It's one of the smaller scoring factors, but it's also one of the most misunderstood, because the impact is often assumed to be bigger and longer-lasting than it actually is.

## The typical impact

A single hard inquiry typically costs a small number of points — commonly cited as under 10 points for most applicants — and inquiries usually stay visible on a credit report for two years, though their effect on the score itself fades well before that, often within a matter of months. [VERIFY: source URL — confirm current FICO/VantageScore guidance on inquiry impact and decay timeline]

## Why one application rarely matters much

For someone with an established credit history and no other red flags, a single new inquiry is a minor, temporary dip — not something that meaningfully changes what you'd qualify for a month later. The bigger risk isn't one inquiry; it's a pattern of several in a short window, which can read to a lender as financial stress rather than normal shopping behavior.

## Rate shopping is treated differently — sometimes

For certain loan types — mortgages, auto loans — scoring models often bundle multiple inquiries made within a short window (commonly around 14 to 45 days depending on the model) into a single scoring event, recognizing that a person shopping for one loan is checking multiple lenders for the same product. [VERIFY: source URL — confirm current rate-shopping windows per scoring model] Credit cards generally are not covered by this treatment — each credit card application is its own separate inquiry, counted individually.

## Where issuer-specific rules matter more than the inquiry itself

Some issuers apply their own limits that have nothing to do with your credit score directly, but still shape whether an application makes sense right now: caps on how many of their cards you can hold at once, rules against approving an application if you've opened too many accounts (at any issuer) within a recent window, and minimum waiting periods between applications for the same card. These are underwriting policies, not credit-scoring mechanics, and they vary by issuer and can change without notice. [VERIFY: source URL — confirm current issuer-specific application rules before citing specific card names or numeric limits]

## The practical rule

Don't avoid a single credit card application out of fear of the inquiry alone — the cost is usually small and temporary. Do think about timing if you're planning several applications close together, or if you have an unrelated big loan (a mortgage, a car loan) on the near-term horizon where lenders will be looking at your file closely.
`;

seedBatch2().catch((err) => {
  console.error(err);
  process.exit(1);
});
