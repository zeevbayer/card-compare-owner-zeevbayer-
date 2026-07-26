import { Newsreader, Public_Sans } from 'next/font/google';

// Headings: a modern news serif — keeps the publication feel the brand is built on.
export const newsreader = Newsreader({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-display',
});

// Body: Public Sans, the US federal government's typeface, drawn for dense public-interest
// information. Reads plainly at small sizes, which is most of this site.
export const publicSans = Public_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-body',
});
