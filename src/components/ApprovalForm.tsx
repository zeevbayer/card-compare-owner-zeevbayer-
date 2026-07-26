'use client';

import { useActionState, useState } from 'react';
import { submitApproval, type SubmitApprovalResult } from '@/app/actions/submit-approval';

const BUREAUS = [
  { value: '', label: "Don't know" },
  { value: 'experian', label: 'Experian' },
  { value: 'transunion', label: 'TransUnion' },
  { value: 'equifax', label: 'Equifax' },
];

const inputClass =
  'mt-1 w-full rounded border border-charcoal-300 bg-white px-3 py-2 text-sm text-charcoal-900';
const labelClass = 'text-xs font-medium uppercase tracking-wide text-charcoal-500';

export default function ApprovalForm({ cardSlug, cardName }: { cardSlug: string; cardName: string }) {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState<SubmitApprovalResult | null, FormData>(
    submitApproval,
    null
  );

  if (state?.ok) {
    return (
      <p className="mt-4 rounded border border-charcoal-300/60 bg-paper-dim px-4 py-3 text-sm text-charcoal-700">
        {state.message}
      </p>
    );
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-4 rounded border border-navy-900 px-4 py-2 text-sm font-medium text-navy-900 transition-colors hover:bg-navy-900 hover:text-paper"
      >
        Report your result for this card
      </button>
    );
  }

  return (
    <form action={formAction} className="mt-4 space-y-4 rounded-lg border border-charcoal-300/60 bg-white p-5">
      <input type="hidden" name="cardSlug" value={cardSlug} />

      <div>
        <h3 className="font-serif-heading text-base font-semibold text-navy-900">
          Report your {cardName} application
        </h3>
        <p className="mt-1 text-xs leading-relaxed text-charcoal-600">
          Only the fields you fill in get published, and every report is reviewed before it appears.
          Don&apos;t include your name, account number, or anything that identifies you — this is
          meant to be anonymous.
        </p>
      </div>

      <fieldset>
        <legend className={labelClass}>Were you approved?</legend>
        <div className="mt-2 flex gap-4 text-sm">
          <label className="flex items-center gap-1.5">
            <input type="radio" name="approved" value="yes" required /> Approved
          </label>
          <label className="flex items-center gap-1.5">
            <input type="radio" name="approved" value="no" required /> Denied
          </label>
        </div>
      </fieldset>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="creditScore" className={labelClass}>
            Credit score at application
          </label>
          <input
            id="creditScore"
            name="creditScore"
            type="number"
            min={300}
            max={850}
            inputMode="numeric"
            placeholder="e.g. 720"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="creditLimit" className={labelClass}>
            Credit limit granted ($)
          </label>
          <input
            id="creditLimit"
            name="creditLimit"
            type="number"
            min={0}
            inputMode="numeric"
            placeholder="Leave blank if denied"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="bureau" className={labelClass}>
            Credit bureau pulled
          </label>
          <select id="bureau" name="bureau" className={inputClass} defaultValue="">
            {BUREAUS.map((b) => (
              <option key={b.value} value={b.value}>
                {b.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="state" className={labelClass}>
            State (2 letters)
          </label>
          <input
            id="state"
            name="state"
            maxLength={2}
            placeholder="e.g. NY"
            className={`${inputClass} uppercase`}
          />
        </div>
        <div>
          <label htmlFor="annualIncome" className={labelClass}>
            Annual income ($)
          </label>
          <input
            id="annualIncome"
            name="annualIncome"
            type="number"
            min={0}
            inputMode="numeric"
            placeholder="Optional"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="creditHistoryYears" className={labelClass}>
            Years of credit history
          </label>
          <input
            id="creditHistoryYears"
            name="creditHistoryYears"
            type="number"
            min={0}
            max={80}
            step="0.5"
            inputMode="decimal"
            placeholder="Optional"
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label htmlFor="notes" className={labelClass}>
          Anything useful for other applicants
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={3}
          maxLength={1000}
          placeholder="e.g. instant approval, or needed a reconsideration call"
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="displayName" className={labelClass}>
          Display name (optional)
        </label>
        <input
          id="displayName"
          name="displayName"
          maxLength={40}
          placeholder="Leave blank to post anonymously"
          className={inputClass}
        />
      </div>

      {/* Honeypot — hidden from people, tempting to bots. */}
      <div aria-hidden="true" className="hidden">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      {state && !state.ok && (
        <p className="rounded border border-amber-600 bg-amber-100 px-3 py-2 text-sm text-amber-700">
          {state.message}
        </p>
      )}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={pending}
          className="rounded bg-navy-900 px-4 py-2 text-sm font-medium text-paper hover:bg-navy-800 disabled:opacity-60"
        >
          {pending ? 'Submitting…' : 'Submit report'}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="rounded border border-charcoal-300 px-4 py-2 text-sm text-charcoal-700 hover:border-navy-900"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
