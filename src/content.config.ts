import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const cards = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/cards' }),
  schema: z.object({
    name: z.string(),
    issuer: z.string(),
    slug: z.string(),
    annualFee: z.number().nullable(),
    purchaseAprMin: z.number().nullable(),
    purchaseAprMax: z.number().nullable(),
    introApr: z.number().nullable(),
    introAprMonths: z.number().nullable(),
    isDeferredInterest: z.boolean().default(false),
    balanceTransferFee: z.number().nullable(),
    foreignTransactionFee: z.number().nullable(),
    rewardsStructure: z.string().nullable(),
    signupBonus: z.string().nullable(),
    signupBonusSpend: z.number().nullable(),
    signupBonusWindow: z.string().nullable(),
    creditScoreTier: z.enum(['excellent', 'good', 'fair', 'building']),
    categories: z.array(z.string()),
    affiliateUrl: z.string().url().nullable(),
    issuerUrl: z.string().url(),
    lastVerified: z.coerce.date().nullable(),
    // Verification/expiry specific to the signup bonus offer, shown on /offers.
    // Distinct from lastVerified, which covers the card's overall terms.
    offerVerified: z.coerce.date().nullable().default(null),
    expiresOn: z.coerce.date().nullable().default(null),
  }),
});

const articles = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/articles' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishDate: z.coerce.date(),
    lastUpdated: z.coerce.date(),
    category: z.string(),
    relatedCards: z.array(z.string()).default([]),
    youtubeId: z.string().optional(),
  }),
});

export const collections = { cards, articles };
