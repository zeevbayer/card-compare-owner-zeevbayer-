import { db } from '@/db';
import { isNotNull } from 'drizzle-orm';
import { cards, articles } from '@/db/schema';
import { isUnverified } from './verification';

export type CardWithRelations = Awaited<ReturnType<typeof getAllCardsWithRelations>>[number];

export async function getAllCardsWithRelations() {
  return db.query.cards.findMany({
    with: {
      issuer: true,
      rewardsProgram: true,
      rewardRates: { with: { category: true } },
      cardBenefits: { with: { benefit: true } },
      credits: true,
    },
    orderBy: (c, { asc }) => [asc(c.name)],
  });
}

/** Cards with no lastVerified are excluded from finder results by default. */
export async function getEligibleCards() {
  const all = await getAllCardsWithRelations();
  return all.filter((c) => !isUnverified(c.lastVerified));
}

export async function getCardBySlug(slug: string) {
  return db.query.cards.findFirst({
    where: (c, { eq }) => eq(c.slug, slug),
    with: {
      issuer: true,
      rewardsProgram: true,
      rewardRates: { with: { category: true } },
      cardBenefits: { with: { benefit: true } },
      credits: true,
      approvalSubmissions: {
        where: (a, { eq }) => eq(a.status, 'approved'),
      },
    },
  });
}

export async function getAllCardSlugs() {
  return db.query.cards.findMany({ columns: { slug: true } });
}

export async function getIssuers() {
  return db.query.issuers.findMany({ orderBy: (i, { asc }) => [asc(i.name)] });
}

export async function getRewardCategories() {
  return db.query.rewardCategories.findMany({ orderBy: (c, { asc }) => [asc(c.label)] });
}

export async function getBenefits() {
  return db.query.benefits.findMany({ orderBy: (b, { asc }) => [asc(b.label)] });
}

export async function getTopics() {
  return db.query.topics.findMany({ orderBy: (t, { asc }) => [asc(t.label)] });
}

export async function getAllArticles() {
  return db.query.articles.findMany({
    with: { topic: true },
    orderBy: (a, { desc }) => [desc(a.publishDate)],
  });
}

export async function getArticleBySlug(slug: string) {
  return db.query.articles.findFirst({
    where: (a, { eq }) => eq(a.slug, slug),
    with: {
      topic: true,
      relatedCards: { with: { card: { with: { issuer: true } } } },
    },
  });
}

export async function getVerifiedCardCount() {
  const rows = await db
    .select({ id: cards.id })
    .from(cards)
    .where(isNotNull(cards.lastVerified));
  return rows.length;
}

export async function getArticleCount() {
  const rows = await db.select({ id: articles.id }).from(articles);
  return rows.length;
}

/** Category slug -> count of eligible (verified) cards in that category. */
export async function getCategoryCounts(): Promise<Record<string, number>> {
  const eligible = await getEligibleCards();
  const counts: Record<string, number> = {};
  for (const card of eligible) {
    for (const r of card.rewardRates) {
      counts[r.category.slug] = (counts[r.category.slug] ?? 0) + 1;
    }
  }
  return counts;
}
