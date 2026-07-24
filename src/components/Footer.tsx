import Link from 'next/link';
import ReopenDisclosureButton from './ReopenDisclosureButton';

const links = [
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
  { href: '/how-we-make-money', label: 'How We Make Money' },
  { href: '/privacy-policy', label: 'Privacy Policy' },
  { href: '/terms', label: 'Terms' },
];

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-navy-700 bg-navy-950 text-charcoal-300">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-amber-500">
              {link.label}
            </Link>
          ))}
          <ReopenDisclosureButton />
        </div>

        <p className="mt-6 max-w-3xl text-xs leading-relaxed text-charcoal-500">
          Card Compare is an independent publisher. Content on this site is educational and
          general in nature — it is not financial, legal, or tax advice, and it is not a
          recommendation to apply for any specific product. Credit card terms, rates, and fees
          change frequently and without notice; always confirm current terms directly with the
          issuer before applying. Some card companies compensate us; that compensation may
          influence which offers appear, but never how they are ranked or described. Not all
          available card offers are included.
        </p>

        <p className="mt-4 text-xs text-charcoal-500">© {year} Card Compare. All rights reserved.</p>
      </div>
    </footer>
  );
}
