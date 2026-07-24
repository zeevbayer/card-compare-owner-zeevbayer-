import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';
import { SITE_NAME, SITE_TAGLINE } from '../lib/seo';

export async function GET(context: APIContext) {
  const articles = await getCollection('articles');
  return rss({
    title: SITE_NAME,
    description: SITE_TAGLINE,
    site: context.site ?? 'https://cardcompare.example.com',
    items: articles
      .sort((a, b) => b.data.publishDate.getTime() - a.data.publishDate.getTime())
      .map((article) => ({
        title: article.data.title,
        description: article.data.description,
        pubDate: article.data.publishDate,
        link: `/articles/${article.id}/`,
      })),
  });
}
