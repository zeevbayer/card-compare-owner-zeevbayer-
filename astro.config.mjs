import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// NOTE: replace with the real production domain before going live.
// Used to build the sitemap, RSS feed, and canonical/OpenGraph URLs.
const SITE_URL = 'https://cardcompare.example.com';

export default defineConfig({
  site: SITE_URL,
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
