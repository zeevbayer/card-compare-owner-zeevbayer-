import type { MetadataRoute } from 'next';
import { getEligibleCards, getAllArticles } from '@/lib/queries';
import { PRESETS } from '@/lib/finder';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://cardcompare.example.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [cards, articles] = await Promise.all([getEligibleCards(), getAllArticles()]);

  const staticRoutes = [
    '',
    '/finder',
    '/offers',
    '/articles',
    '/approvals',
    '/resources',
    '/how-we-make-money',
    '/about',
    '/contact',
    '/privacy-policy',
    '/terms',
  ].map((path) => ({ url: `${SITE_URL}${path}`, lastModified: new Date() }));

  const presetRoutes = PRESETS.map((p) => ({
    url: `${SITE_URL}/finder/${p.slug}`,
    lastModified: new Date(),
  }));

  const cardRoutes = cards.map((c) => ({
    url: `${SITE_URL}/cards/${c.slug}`,
    lastModified: new Date(c.updatedAt),
  }));

  const articleRoutes = articles.map((a) => ({
    url: `${SITE_URL}/articles/${a.slug}`,
    lastModified: new Date(a.lastUpdated),
  }));

  return [...staticRoutes, ...presetRoutes, ...cardRoutes, ...articleRoutes];
}
