import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About',
  description: 'What Card Compare is and why it exists: an analytical, skeptical read on credit card terms.',
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <h1 className="font-serif-heading text-3xl font-semibold text-navy-900">About Card Compare</h1>
      <div className="prose prose-slate mt-6 max-w-none">
        <p>
          Card Compare exists because most credit card marketing is built to obscure, not inform.
          &quot;0% intro APR&quot; and &quot;no interest if paid in full&quot; sound identical and
          mean very different things. A 30%+ APR on a store card can erase a discount within a
          year. Rate tables bury the numbers that matter behind the ones that don&apos;t.
        </p>
        <p>
          We start from the assumption that you don&apos;t have time to read a 4,000-word
          cardholder agreement, and that you shouldn&apos;t have to. So we read them, extract the
          numbers that actually affect what you pay, and keep them current — or say plainly when
          we haven&apos;t verified them recently.
        </p>
        <p>
          This is not a deals site. We don&apos;t use urgency language, countdown timers, or
          &quot;editor&apos;s pick&quot; badges, and affiliate relationships never influence how a
          card is ranked or described. See <a href="/how-we-make-money">how we make money</a> for
          the specifics.
        </p>
      </div>
    </div>
  );
}
