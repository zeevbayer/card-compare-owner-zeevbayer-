import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import CardResult from '@/components/CardResult';
import AffiliateDisclosureNotice from '@/components/AffiliateDisclosureNotice';
import { getArticleBySlug, getAllArticles } from '@/lib/queries';
import { getCardBySlug } from '@/lib/queries';
import { formatDate } from '@/lib/format';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const articles = await getAllArticles();
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return {};
  return { title: article.title, description: article.description };
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  const relatedCards = await Promise.all(
    article.relatedCards.map((rc) => getCardBySlug(rc.card.slug))
  );
  const cards = relatedCards.filter((c): c is NonNullable<typeof c> => c !== undefined);
  const hasAffiliateLinks = cards.some((c) => Boolean(c.affiliateUrl));

  return (
    <article className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <p className="text-xs uppercase tracking-wide text-charcoal-500">{article.topic.label}</p>
      <h1 className="font-serif-heading mt-2 text-3xl font-semibold text-navy-900">{article.title}</h1>
      <p className="mt-2 text-sm text-charcoal-500">
        Published {formatDate(article.publishDate)}
        {article.lastUpdated !== article.publishDate && ` · Updated ${formatDate(article.lastUpdated)}`}
      </p>

      {cards.length > 0 && hasAffiliateLinks && (
        <div className="mt-6">
          <AffiliateDisclosureNotice />
        </div>
      )}

      {article.youtubeId && (
        <div className="mt-6 aspect-video w-full overflow-hidden rounded-lg border border-charcoal-300/60">
          <iframe
            className="h-full w-full"
            src={`https://www.youtube-nocookie.com/embed/${article.youtubeId}`}
            title={article.title}
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      )}

      <div className="prose prose-slate mt-8 max-w-none">
        <ReactMarkdown>{article.body}</ReactMarkdown>
      </div>

      {cards.length > 0 && (
        <div className="mt-10 border-t border-charcoal-300/60 pt-8">
          <h2 className="font-serif-heading text-xl font-semibold text-navy-900">
            Cards mentioned in this article
          </h2>
          <div className="mt-4 space-y-4">
            {cards.map((card) => (
              <CardResult key={card.id} card={card} />
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
