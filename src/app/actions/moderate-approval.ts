'use server';

import { revalidatePath } from 'next/cache';
import { db } from '@/db';
import { approvalSubmissions, cards } from '@/db/schema';
import { eq } from 'drizzle-orm';

function assertAuthorized(token: string) {
  const expected = process.env.ADMIN_TOKEN;
  if (!expected) {
    throw new Error('ADMIN_TOKEN is not configured on the server.');
  }
  if (token !== expected) {
    throw new Error('Not authorized.');
  }
}

export async function moderateApproval(formData: FormData) {
  const token = String(formData.get('token') ?? '');
  assertAuthorized(token);

  const id = Number(formData.get('id'));
  const decision = String(formData.get('decision'));

  if (!Number.isInteger(id)) throw new Error('Bad submission id.');
  if (decision !== 'approved' && decision !== 'rejected') throw new Error('Bad decision.');

  const submission = await db.query.approvalSubmissions.findFirst({
    where: eq(approvalSubmissions.id, id),
  });
  if (!submission) throw new Error('Submission not found.');

  await db
    .update(approvalSubmissions)
    .set({ status: decision })
    .where(eq(approvalSubmissions.id, id));

  // Refresh the card page so a published report appears without waiting for revalidation.
  const card = await db.query.cards.findFirst({ where: eq(cards.id, submission.cardId) });
  if (card) revalidatePath(`/cards/${card.slug}`);
  revalidatePath('/approvals');
  revalidatePath('/admin/approvals');
}
