'use server';

import { z } from 'zod';
import { db } from '@/db';
import { approvalSubmissions, cards } from '@/db/schema';
import { eq } from 'drizzle-orm';

const US_STATES = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME',
  'MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA',
  'RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY','DC',
] as const;

const emptyToUndefined = (v: unknown) => (v === '' || v === null ? undefined : v);

const submissionSchema = z.object({
  cardSlug: z.string().min(1),
  approved: z.enum(['yes', 'no']),
  creditScore: z.preprocess(
    emptyToUndefined,
    z.coerce.number().int().min(300).max(850).optional()
  ),
  creditLimit: z.preprocess(
    emptyToUndefined,
    z.coerce.number().min(0).max(1_000_000).optional()
  ),
  bureau: z.preprocess(emptyToUndefined, z.enum(['experian', 'transunion', 'equifax']).optional()),
  state: z.preprocess(emptyToUndefined, z.enum(US_STATES).optional()),
  annualIncome: z.preprocess(
    emptyToUndefined,
    z.coerce.number().min(0).max(100_000_000).optional()
  ),
  creditHistoryYears: z.preprocess(
    emptyToUndefined,
    z.coerce.number().min(0).max(80).optional()
  ),
  notes: z.preprocess(emptyToUndefined, z.string().max(1000).optional()),
  displayName: z.preprocess(emptyToUndefined, z.string().max(40).optional()),
  // Honeypot: a hidden field real users never fill in.
  website: z.string().max(0).optional(),
});

export interface SubmitApprovalResult {
  ok: boolean;
  message: string;
}

export async function submitApproval(
  _prev: SubmitApprovalResult | null,
  formData: FormData
): Promise<SubmitApprovalResult> {
  const raw = Object.fromEntries(formData.entries());
  const parsed = submissionSchema.safeParse(raw);

  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return { ok: false, message: first ? `${first.path.join('.')}: ${first.message}` : 'Invalid submission.' };
  }

  const data = parsed.data;

  // Honeypot tripped — accept silently so bots don't learn, but store nothing.
  if (data.website) {
    return { ok: true, message: 'Thanks — your report was submitted for review.' };
  }

  const card = await db.query.cards.findFirst({ where: eq(cards.slug, data.cardSlug) });
  if (!card) {
    return { ok: false, message: 'That card no longer exists.' };
  }

  await db.insert(approvalSubmissions).values({
    cardId: card.id,
    approved: data.approved === 'yes',
    creditScore: data.creditScore ?? null,
    creditLimit: data.creditLimit !== undefined ? String(data.creditLimit) : null,
    bureau: data.bureau ?? null,
    state: data.state ?? null,
    annualIncome: data.annualIncome !== undefined ? String(data.annualIncome) : null,
    creditHistoryYears:
      data.creditHistoryYears !== undefined ? String(data.creditHistoryYears) : null,
    notes: data.notes ?? null,
    displayName: data.displayName ?? null,
    // Everything waits for review. Nothing a stranger types appears on the site unread.
    status: 'pending',
  });

  return {
    ok: true,
    message: 'Thanks — your report was submitted and will appear once it has been reviewed.',
  };
}
