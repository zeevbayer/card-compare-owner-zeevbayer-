'use client';

import { REOPEN_EVENT } from './AdvertiserDisclosureBar';

export default function ReopenDisclosureButton() {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(REOPEN_EVENT))}
      className="cursor-pointer text-left hover:text-amber-500"
    >
      Advertiser Disclosure
    </button>
  );
}
