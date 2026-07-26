import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AdvertiserDisclosureBar from '@/components/AdvertiserDisclosureBar';
import { newsreader, publicSans } from './fonts';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://cardcompare.example.com';

const fontClasses = `${newsreader.variable} ${publicSans.variable}`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: 'Card Compare', template: '%s · Card Compare' },
  description: 'An analytical, independent read on credit card terms.',
  icons: { icon: '/favicon.svg' },
  openGraph: {
    siteName: 'Card Compare',
    type: 'website',
    images: ['/og-default.svg'],
  },
  twitter: {
    card: 'summary_large_image',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={fontClasses}>
      <body className="flex min-h-screen flex-col bg-paper text-charcoal-900 antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-50 focus:rounded focus:bg-navy-900 focus:px-3 focus:py-2 focus:text-paper"
        >
          Skip to content
        </a>
        <Header />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
        <AdvertiserDisclosureBar />
      </body>
    </html>
  );
}
