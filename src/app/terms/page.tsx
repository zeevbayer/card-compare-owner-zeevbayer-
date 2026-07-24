import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Terms of Use', description: "Card Compare's terms of use." };

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <h1 className="font-serif-heading text-3xl font-semibold text-navy-900">Terms of Use</h1>
      <div className="prose prose-slate mt-6 max-w-none">
        <p>
          <em>Placeholder — have this reviewed before launch.</em>
        </p>
        <p>
          Card Compare provides general, educational information about credit card products. It
          is not financial, legal, or tax advice, and nothing on this site is a guarantee of
          approval, rate, or terms for any product. Card terms are set solely by the issuer and
          change without notice; always confirm current terms directly with the issuer before
          applying.
        </p>
        <p>
          Community-submitted data (once the Approval Database ships) reflects self-reported user
          experiences, not issuer guarantees. Sample sizes may be small and results should not be
          treated as approval odds.
        </p>
        <p>
          We aim to keep figures accurate and current — see each card&apos;s &quot;last
          verified&quot; date — but we make no warranty as to completeness or accuracy, and we are
          not liable for decisions made based on information on this site.
        </p>
        <p>
          Some outbound links are affiliate links; see <a href="/how-we-make-money">how we make money</a>.
        </p>
      </div>
    </div>
  );
}
