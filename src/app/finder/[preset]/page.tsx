import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import CardResult from '@/components/CardResult';
import AffiliateDisclosureNotice from '@/components/AffiliateDisclosureNotice';
import { getEligibleCards } from '@/lib/queries';
import { filterCards, sortCards, getPreset, PRESETS } from '@/lib/finder';

interface PageProps {
  params: Promise<{ preset: string }>;
}

export function generateStaticParams() {
  return PRESETS.map((p) => ({ preset: p.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { preset: slug } = await params;
  const preset = getPreset(slug);
  if (!preset) return {};
  return { title: preset.title, description: preset.intro };
}

export default async function PresetPage({ params }: PageProps) {
  const { preset: slug } = await params;
  const preset = getPreset(slug);
  if (!preset) notFound();

  const allCards = await getEligibleCards();
  const cards = sortCards(filterCards(allCards, preset.filters), preset.filters.sort, preset.filters.dir);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <p className="text-sm text-charcoal-500">
        <Link href="/finder" className="hover:text-amber-700">
          Card Finder
        </Link>{' '}
        / {preset.shortLabel}
      </p>
      <h1 className="font-serif-heading mt-2 text-3xl font-semibold text-navy-900">{preset.title}</h1>
      <p className="mt-3 max-w-2xl text-charcoal-700">{preset.intro}</p>

      <div className="mt-6">
        <AffiliateDisclosureNotice />
      </div>

      <p className="mt-8 mb-4 text-sm text-charcoal-500">{cards.length} cards</p>

      <div className="space-y-4">
        {cards.map((card) => (
          <CardResult key={card.id} card={card} />
        ))}
      </div>

      {cards.length === 0 && (
        <p className="text-charcoal-600">
          No verified cards currently match this preset. Check back once we have verified terms
          on file, or browse the full{' '}
          <Link href="/finder" className="text-amber-700 underline">
            finder
          </Link>
          .
        </p>
      )}

      <p className="mt-10 text-sm">
        <Link href="/finder" className="text-amber-700 underline hover:text-amber-600">
          See all filters in the full card finder →
        </Link>
      </p>
    </div>
  );
}
