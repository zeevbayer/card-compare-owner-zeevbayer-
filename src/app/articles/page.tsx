import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllArticles, getTopics } from '@/lib/queries';
import { formatDate } from '@/lib/format';

export const metadata: Metadata = {
  title: 'Articles',
  description: 'Analytical, number-driven explainers on how credit card terms actually work.',
};

interface PageProps {
  searchParams: Promise<{ topic?: string }>;
}

export default async function ArticlesPage({ searchParams }: PageProps) {
  const { topic: activeTopic } = await searchParams;
  const [articles, topics] = await Promise.all([getAllArticles(), getTopics()]);
  const filtered = activeTopic ? articles.filter((a) => a.topic.slug === activeTopic) : articles;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="font-serif-heading text-3xl font-semibold text-navy-900">Articles</h1>
      <p className="mt-2 text-charcoal-700">
        Explainers on the terms and mechanics card issuers rely on you not reading closely.
      </p>

      <div className="mt-6 flex flex-wrap gap-2" role="group" aria-label="Filter by topic">
        <Link
          href="/articles"
          className={`rounded-full border px-3 py-1 text-xs font-medium ${
            !activeTopic
              ? 'border-navy-900 bg-navy-900 text-paper'
              : 'border-charcoal-300 text-charcoal-700 hover:border-navy-900'
          }`}
        >
          All
        </Link>
        {topics.map((t) => (
          <Link
            key={t.slug}
            href={`/articles?topic=${t.slug}`}
            className={`rounded-full border px-3 py-1 text-xs font-medium ${
              activeTopic === t.slug
                ? 'border-navy-900 bg-navy-900 text-paper'
                : 'border-charcoal-300 text-charcoal-700 hover:border-navy-900'
            }`}
          >
            {t.label}
          </Link>
        ))}
      </div>

      <div className="mt-8 space-y-6">
        {filtered.map((article) => (
          <article key={article.slug} className="border-b border-charcoal-300/60 pb-6">
            <p className="text-xs uppercase tracking-wide text-charcoal-500">
              {article.topic.label} · {formatDate(article.publishDate)}
            </p>
            <h2 className="font-serif-heading mt-1 text-xl font-semibold text-navy-900">
              <Link href={`/articles/${article.slug}`} className="hover:text-amber-700">
                {article.title}
              </Link>
            </h2>
            <p className="mt-2 text-charcoal-700">{article.description}</p>
          </article>
        ))}
        {filtered.length === 0 && <p className="text-charcoal-600">No articles in this topic yet.</p>}
      </div>
    </div>
  );
}
