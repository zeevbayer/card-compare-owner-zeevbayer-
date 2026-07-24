import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Contact', description: 'Get in touch with Card Compare.' };

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <h1 className="font-serif-heading text-3xl font-semibold text-navy-900">Contact</h1>
      <div className="prose prose-slate mt-6 max-w-none">
        <p>
          Spotted an error, an out-of-date figure, or a card that needs re-verifying? We&apos;d
          rather hear about it than have a stale number sit on the site.
        </p>
        <p>
          Email: <a href="mailto:hello@cardcompare.example.com">hello@cardcompare.example.com</a>
        </p>
        <p className="text-sm text-charcoal-500">Replace with a real inbox before launch.</p>
      </div>
    </div>
  );
}
