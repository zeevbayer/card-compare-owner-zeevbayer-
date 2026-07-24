import Link from 'next/link';
import { getTopics } from '@/lib/queries';

export default async function Header() {
  const topics = await getTopics();

  return (
    <header className="border-b border-navy-700 bg-navy-900 text-paper">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link href="/" className="font-serif-heading text-xl font-semibold tracking-tight text-paper">
          Card Compare
        </Link>
        <nav aria-label="Primary" className="hidden items-center gap-6 text-sm md:flex">
          <Link href="/finder" className="text-charcoal-300 transition-colors hover:text-amber-500">
            Search Credit Cards
          </Link>

          <div className="group relative">
            <button className="flex items-center gap-1 text-charcoal-300 transition-colors hover:text-amber-500">
              Explore Topics
              <span aria-hidden="true">▾</span>
            </button>
            <div className="invisible absolute left-0 top-full z-20 min-w-[200px] rounded border border-navy-700 bg-navy-900 py-2 opacity-0 shadow-lg transition-opacity group-hover:visible group-hover:opacity-100">
              <Link
                href="/articles"
                className="block px-4 py-2 text-sm text-charcoal-300 hover:bg-navy-800 hover:text-amber-500"
              >
                Latest
              </Link>
              {topics.map((topic) => (
                <Link
                  key={topic.slug}
                  href={`/articles?topic=${topic.slug}`}
                  className="block px-4 py-2 text-sm text-charcoal-300 hover:bg-navy-800 hover:text-amber-500"
                >
                  {topic.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="group relative">
            <button className="flex items-center gap-1 text-charcoal-300 transition-colors hover:text-amber-500">
              Resources
              <span aria-hidden="true">▾</span>
            </button>
            <div className="invisible absolute left-0 top-full z-20 min-w-[200px] rounded border border-navy-700 bg-navy-900 py-2 opacity-0 shadow-lg transition-opacity group-hover:visible group-hover:opacity-100">
              <Link
                href="/resources"
                className="block px-4 py-2 text-sm text-charcoal-300 hover:bg-navy-800 hover:text-amber-500"
              >
                Free Guides
              </Link>
              <Link
                href="/resources"
                className="block px-4 py-2 text-sm text-charcoal-300 hover:bg-navy-800 hover:text-amber-500"
              >
                Approval Database
              </Link>
            </div>
          </div>
        </nav>
        <Link
          href="/finder"
          className="rounded border border-amber-600 px-3 py-1.5 text-sm text-amber-500 transition-colors hover:bg-amber-600 hover:text-navy-950 md:hidden"
        >
          Finder
        </Link>
      </div>
      <nav aria-label="Primary mobile" className="flex gap-4 overflow-x-auto px-4 pb-3 text-sm md:hidden">
        <Link href="/finder" className="whitespace-nowrap text-charcoal-300 hover:text-amber-500">
          Search Cards
        </Link>
        <Link href="/articles" className="whitespace-nowrap text-charcoal-300 hover:text-amber-500">
          Explore Topics
        </Link>
        <Link href="/resources" className="whitespace-nowrap text-charcoal-300 hover:text-amber-500">
          Resources
        </Link>
      </nav>
    </header>
  );
}
