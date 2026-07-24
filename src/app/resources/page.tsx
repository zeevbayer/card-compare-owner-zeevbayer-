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
            A community-submitted database of real approval and denial outcomes — credit score,
            limit, state, and bureau pulled. This needs user accounts and a moderation system, so
            it&apos;s phase 2 of this build, not live yet.
          </p>
        </div>
      </div>
    </div>
  );
}
