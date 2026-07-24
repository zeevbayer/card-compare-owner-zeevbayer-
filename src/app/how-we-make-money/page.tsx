import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'How We Make Money',
  description:
    'Our affiliate disclosure: how Card Compare is funded, and the editorial rules that keep compensation from affecting rankings.',
};

export default function HowWeMakeMoneyPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <h1 className="font-serif-heading text-3xl font-semibold text-navy-900">How We Make Money</h1>

      <div className="prose prose-slate mt-6 max-w-none">
        <p>
          Card Compare is supported in part by affiliate relationships with some of the card
          issuers and networks covered on this site. When you apply for a card through certain
          links here, we may receive a commission. This does not change what you pay or what
          terms you&apos;re offered.
        </p>
        <p>
          We also cover many cards for which we have no financial relationship at all. They are
          included for the same reason as everything else on the site: because they are relevant
          to what you&apos;re comparing.
        </p>
        <h2>What compensation does not affect</h2>
        <ul>
          <li>Sort order in the card finder and on the offers page, which is determined solely by the sort criteria you choose.</li>
          <li>Which cards appear in a given category or preset.</li>
          <li>How a card is described, including its downsides.</li>
          <li>Visual treatment — cards with and without an affiliate relationship use identical layouts, buttons, and positioning logic.</li>
        </ul>
        <p>
          We do not operate a &quot;featured,&quot; &quot;sponsored,&quot; or &quot;editor&apos;s
          pick&quot; placement mechanism. If you ever see something on this site that looks like
          compensation is influencing ranking or presentation, tell us — that would be a bug, not
          a business model.
        </p>
        <h2>The numbers</h2>
        <p>
          Every card page and finder result shows a &quot;last verified&quot; date, and offers
          disappear automatically if we haven&apos;t reconfirmed them within 30 days or if
          they&apos;ve expired. That applies equally to cards that pay us and cards that
          don&apos;t.
        </p>
        <p>
          This site is educational and general in nature. It is not financial, legal, or tax
          advice, and nothing here is a recommendation to apply for any specific product. Terms
          change; confirm current details directly with the issuer before applying.
        </p>
      </div>
    </div>
  );
}
