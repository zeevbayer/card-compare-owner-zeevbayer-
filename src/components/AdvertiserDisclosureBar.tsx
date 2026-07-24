'use client';

import { useEffect, useState } from 'react';

const KEY = 'advertiser-disclosure-dismissed';
export const REOPEN_EVENT = 'advertiser-disclosure:reopen';

export default function AdvertiserDisclosureBar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (window.localStorage.getItem(KEY) !== 'true') {
      setVisible(true);
    }
    const onReopen = () => {
      window.localStorage.removeItem(KEY);
      setVisible(true);
    };
    window.addEventListener(REOPEN_EVENT, onReopen);
    return () => window.removeEventListener(REOPEN_EVENT, onReopen);
  }, []);

  if (!visible) return null;

  return (
    <div
      id="advertiser-disclosure-bar"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-amber-600 bg-navy-950 text-paper"
      role="region"
      aria-label="Advertiser disclosure"
    >
      <div className="mx-auto flex max-w-6xl items-start gap-4 px-4 py-3 sm:px-6">
        <p className="flex-1 text-xs leading-relaxed text-charcoal-300 sm:text-sm">
          Although we work to give our readers unbiased information, and we include many credit
          card offers for which we receive no compensation, we are legally required to notify you
          that we may receive compensation from some of the credit card companies mentioned on
          this site. This compensation may impact how and where offers appear. This site does not
          include all available credit card offers.
        </p>
        <button
          type="button"
          onClick={() => {
            window.localStorage.setItem(KEY, 'true');
            setVisible(false);
          }}
          className="shrink-0 rounded border border-charcoal-500 px-2 py-1 text-xs text-charcoal-300 hover:border-amber-500 hover:text-amber-500"
          aria-label="Dismiss advertiser disclosure"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
}
