import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Resources',
  description: 'Free guides and the community Approval Database — coming soon.',
};

export default function ResourcesPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <h1 className="font-serif-heading text-3xl font-semibold text-navy-900">Resources</h1>
      <div className="mt-6 space-y-6">
        <div className="rounded-lg border border-charcoal-300/60 bg-white p-5">
          <h2 className="font-serif-heading text-lg font-semibold text-navy-900">Free Guides</h2>
          <p className="mt-2 text-sm text-charcoal-700">
            Downloadable guides on building credit, eliminating debt, and using cards
            strategically. Not built yet — on the roadmap.
          </p>
        </div>
        <div className="rounded-lg border border-charcoal-300/60 bg-white p-5">
          <h2 className="font-serif-heading text-lg font-semibold text-navy-900">Approval Database</h2>
          <p className="mt-2 text-sm text-charcoal-700">
            Reader-submitted approval and denial reports — credit score, limit granted, state, and
            which bureau the issuer pulled. Every report is reviewed before it appears.
          </p>
          <a
            href="/approvals"
            className="mt-3 inline-block text-sm text-amber-700 underline hover:text-amber-600"
          >
            Browse the approval database →
          </a>
        </div>
      </div>
    </div>
  );
}
