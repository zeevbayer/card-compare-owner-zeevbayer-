import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Privacy Policy', description: "Card Compare's privacy policy." };

export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <h1 className="font-serif-heading text-3xl font-semibold text-navy-900">Privacy Policy</h1>
      <div className="prose prose-slate mt-6 max-w-none">
        <p>
          <em>Placeholder — replace with a policy reviewed for your actual data practices before launch.</em>
        </p>
        <p>
          This site does not currently require an account for the card finder or articles. If you
          click through to an issuer&apos;s application page, that issuer&apos;s own privacy
          policy governs the information you provide them — Card Compare does not see or store it.
        </p>
        <h2>Accounts (planned)</h2>
        <p>
          [FILL IN once accounts and the card-tracking app ship: what account data is collected,
          how it&apos;s stored, and how a user can delete it.]
        </p>
        <h2>Analytics</h2>
        <p>
          [FILL IN: describe any analytics or tracking tools in use, e.g. cookie-based analytics,
          and how a visitor can opt out.]
        </p>
        <h2>Affiliate links</h2>
        <p>
          Some outbound links are affiliate links, described in full on our{' '}
          <a href="/how-we-make-money">how we make money</a> page. Clicking one may set a tracking
          parameter or cookie used to attribute a resulting application to us; it does not affect
          the terms you&apos;re offered.
        </p>
        <h2>Contact</h2>
        <p>
          Questions about this policy: see our <a href="/contact">contact page</a>.
        </p>
      </div>
    </div>
  );
}
