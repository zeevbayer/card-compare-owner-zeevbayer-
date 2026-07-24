import { getAllArticles } from '@/lib/queries';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://cardcompare.example.com';

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function GET() {
  const articles = await getAllArticles();

  const items = articles
    .map(
      (a) => `
    <item>
      <title>${escapeXml(a.title)}</title>
      <description>${escapeXml(a.description)}</description>
      <link>${SITE_URL}/articles/${a.slug}</link>
      <guid>${SITE_URL}/articles/${a.slug}</guid>
      <pubDate>${new Date(a.publishDate).toUTCString()}</pubDate>
    </item>`
    )
    .join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Card Compare</title>
    <description>An analytical, independent read on credit card terms.</description>
    <link>${SITE_URL}</link>
    ${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
}
