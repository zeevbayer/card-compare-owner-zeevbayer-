import {
  pgTable,
  serial,
  text,
  varchar,
  integer,
  numeric,
  boolean,
  date,
  timestamp,
  pgEnum,
  primaryKey,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const creditScoreTierEnum = pgEnum('credit_score_tier', [
  'excellent',
  'good',
  'fair',
  'building',
]);

export const cardTypeEnum = pgEnum('card_type', [
  'personal',
  'business',
  'business_reports_personal',
  'secured',
]);

export const creditBureauEnum = pgEnum('credit_bureau', [
  'experian',
  'transunion',
  'equifax',
]);

export const approvalStatusEnum = pgEnum('approval_status', [
  'pending',
  'approved',
  'rejected',
]);

// --- Issuers (banks) ---
export const issuers = pgTable('issuers', {
  id: serial('id').primaryKey(),
  slug: varchar('slug', { length: 80 }).notNull().unique(),
  name: varchar('name', { length: 120 }).notNull(),
  url: text('url').notNull(),
});

// --- Reward categories (groceries, gas, travel, dining, ...) ---
export const rewardCategories = pgTable('reward_categories', {
  id: serial('id').primaryKey(),
  slug: varchar('slug', { length: 80 }).notNull().unique(),
  label: varchar('label', { length: 120 }).notNull(),
});

// --- Rewards programs (Chase Ultimate Rewards, Amex Membership Rewards, ...) ---
export const rewardsProgramTypeEnum = pgEnum('rewards_program_type', [
  'bank_points',
  'airline',
  'hotel',
  'store',
  'cash_back',
  'fuel',
  'cruise',
  'retail_loyalty',
  'credit_union',
  'crypto',
]);

export const rewardsPrograms = pgTable('rewards_programs', {
  id: serial('id').primaryKey(),
  slug: varchar('slug', { length: 80 }).notNull().unique(),
  label: varchar('label', { length: 120 }).notNull(),
  type: rewardsProgramTypeEnum('type').notNull(),
});

// --- Benefits (lounge access, trip cancellation insurance, ...) ---
export const benefits = pgTable('benefits', {
  id: serial('id').primaryKey(),
  slug: varchar('slug', { length: 80 }).notNull().unique(),
  label: varchar('label', { length: 160 }).notNull(),
  description: text('description'),
});

// --- Cards ---
export const cards = pgTable('cards', {
  id: serial('id').primaryKey(),
  slug: varchar('slug', { length: 120 }).notNull().unique(),
  name: varchar('name', { length: 160 }).notNull(),
  issuerId: integer('issuer_id')
    .notNull()
    .references(() => issuers.id),
  rewardsProgramId: integer('rewards_program_id').references(() => rewardsPrograms.id),

  cardType: cardTypeEnum('card_type').notNull().default('personal'),
  creditScoreTier: creditScoreTierEnum('credit_score_tier').notNull(),

  // Rates & fees — left null until verified against the issuer. Never guess.
  annualFee: numeric('annual_fee', { precision: 8, scale: 2 }),
  purchaseAprMin: numeric('purchase_apr_min', { precision: 5, scale: 2 }),
  purchaseAprMax: numeric('purchase_apr_max', { precision: 5, scale: 2 }),
  introApr: numeric('intro_apr', { precision: 5, scale: 2 }),
  introAprMonths: integer('intro_apr_months'),
  isDeferredInterest: boolean('is_deferred_interest').notNull().default(false),
  balanceTransferFeePct: numeric('balance_transfer_fee_pct', { precision: 5, scale: 2 }),
  foreignTransactionFeePct: numeric('foreign_transaction_fee_pct', { precision: 5, scale: 2 }),

  // Welcome offer
  welcomeOfferDescription: text('welcome_offer_description'),
  welcomeOfferEstimatedValue: numeric('welcome_offer_estimated_value', {
    precision: 10,
    scale: 2,
  }),
  welcomeOfferSpendRequirement: numeric('welcome_offer_spend_requirement', {
    precision: 10,
    scale: 2,
  }),
  welcomeOfferWindow: varchar('welcome_offer_window', { length: 80 }),

  // Editorial
  overview: text('overview'),
  bestFor: text('best_for'),

  // Application tips — practical, issuer-specific info
  likelyCreditBureau: creditBureauEnum('likely_credit_bureau'),
  applicationNotes: text('application_notes'),
  reconsiderationPhone: varchar('reconsideration_phone', { length: 40 }),
  applicationStatusPhone: varchar('application_status_phone', { length: 40 }),
  instantCardNumber: boolean('instant_card_number'),
  expeditedShippingAvailable: boolean('expedited_shipping_available'),

  imageUrl: text('image_url'),
  affiliateUrl: text('affiliate_url'),
  issuerUrl: text('issuer_url').notNull(),

  lastVerified: date('last_verified'),
  offerVerified: date('offer_verified'),
  expiresOn: date('expires_on'),

  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// --- Card <-> reward category rates (many-to-many with a rate) ---
export const cardRewardRates = pgTable(
  'card_reward_rates',
  {
    cardId: integer('card_id')
      .notNull()
      .references(() => cards.id, { onDelete: 'cascade' }),
    categoryId: integer('category_id')
      .notNull()
      .references(() => rewardCategories.id),
    ratePct: numeric('rate_pct', { precision: 5, scale: 2 }),
    cap: text('cap'),
    notes: text('notes'),
  },
  (t) => [primaryKey({ columns: [t.cardId, t.categoryId] })]
);

// --- Card <-> benefits (many-to-many) ---
export const cardBenefits = pgTable(
  'card_benefits',
  {
    cardId: integer('card_id')
      .notNull()
      .references(() => cards.id, { onDelete: 'cascade' }),
    benefitId: integer('benefit_id')
      .notNull()
      .references(() => benefits.id),
    details: text('details'),
  },
  (t) => [primaryKey({ columns: [t.cardId, t.benefitId] })]
);

// --- Credits (e.g. $10/month Uber credit) ---
export const cardCredits = pgTable('card_credits', {
  id: serial('id').primaryKey(),
  cardId: integer('card_id')
    .notNull()
    .references(() => cards.id, { onDelete: 'cascade' }),
  label: varchar('label', { length: 160 }).notNull(),
  valueAmount: numeric('value_amount', { precision: 8, scale: 2 }),
  frequency: varchar('frequency', { length: 40 }), // monthly / quarterly / annual
  enrollmentRequired: boolean('enrollment_required').notNull().default(false),
  eligibleMerchant: varchar('eligible_merchant', { length: 160 }),
  redemptionConditions: text('redemption_conditions'),
});

// --- Topics (article categories) ---
export const topics = pgTable('topics', {
  id: serial('id').primaryKey(),
  slug: varchar('slug', { length: 80 }).notNull().unique(),
  label: varchar('label', { length: 120 }).notNull(),
});

// --- Articles ---
export const articles = pgTable('articles', {
  id: serial('id').primaryKey(),
  slug: varchar('slug', { length: 160 }).notNull().unique(),
  title: varchar('title', { length: 200 }).notNull(),
  description: text('description').notNull(),
  body: text('body').notNull(),
  topicId: integer('topic_id')
    .notNull()
    .references(() => topics.id),
  youtubeId: varchar('youtube_id', { length: 40 }),
  publishDate: date('publish_date').notNull(),
  lastUpdated: date('last_updated').notNull(),
});

export const articleRelatedCards = pgTable(
  'article_related_cards',
  {
    articleId: integer('article_id')
      .notNull()
      .references(() => articles.id, { onDelete: 'cascade' }),
    cardId: integer('card_id')
      .notNull()
      .references(() => cards.id, { onDelete: 'cascade' }),
  },
  (t) => [primaryKey({ columns: [t.articleId, t.cardId] })]
);

// --- Users (foundation for phase 2 accounts) ---
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 160 }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// --- Approval submissions (foundation for phase 2 crowdsourced approval database) ---
export const approvalSubmissions = pgTable('approval_submissions', {
  id: serial('id').primaryKey(),
  cardId: integer('card_id')
    .notNull()
    .references(() => cards.id, { onDelete: 'cascade' }),
  userId: integer('user_id').references(() => users.id),
  approved: boolean('approved').notNull(),
  creditScore: integer('credit_score'),
  creditLimit: numeric('credit_limit', { precision: 10, scale: 2 }),
  bureau: creditBureauEnum('bureau'),
  state: varchar('state', { length: 2 }),
  annualIncome: numeric('annual_income', { precision: 12, scale: 2 }),
  creditHistoryYears: numeric('credit_history_years', { precision: 4, scale: 1 }),
  notes: text('notes'),
  displayName: varchar('display_name', { length: 60 }),
  status: approvalStatusEnum('status').notNull().default('pending'),
  submittedAt: timestamp('submitted_at').notNull().defaultNow(),
});

// --- Relations ---
export const cardsRelations = relations(cards, ({ one, many }) => ({
  issuer: one(issuers, { fields: [cards.issuerId], references: [issuers.id] }),
  rewardsProgram: one(rewardsPrograms, {
    fields: [cards.rewardsProgramId],
    references: [rewardsPrograms.id],
  }),
  rewardRates: many(cardRewardRates),
  cardBenefits: many(cardBenefits),
  credits: many(cardCredits),
  approvalSubmissions: many(approvalSubmissions),
}));

export const cardRewardRatesRelations = relations(cardRewardRates, ({ one }) => ({
  card: one(cards, { fields: [cardRewardRates.cardId], references: [cards.id] }),
  category: one(rewardCategories, {
    fields: [cardRewardRates.categoryId],
    references: [rewardCategories.id],
  }),
}));

export const cardBenefitsRelations = relations(cardBenefits, ({ one }) => ({
  card: one(cards, { fields: [cardBenefits.cardId], references: [cards.id] }),
  benefit: one(benefits, { fields: [cardBenefits.benefitId], references: [benefits.id] }),
}));

export const cardCreditsRelations = relations(cardCredits, ({ one }) => ({
  card: one(cards, { fields: [cardCredits.cardId], references: [cards.id] }),
}));

export const articlesRelations = relations(articles, ({ one, many }) => ({
  topic: one(topics, { fields: [articles.topicId], references: [topics.id] }),
  relatedCards: many(articleRelatedCards),
}));

export const articleRelatedCardsRelations = relations(articleRelatedCards, ({ one }) => ({
  article: one(articles, {
    fields: [articleRelatedCards.articleId],
    references: [articles.id],
  }),
  card: one(cards, { fields: [articleRelatedCards.cardId], references: [cards.id] }),
}));

export const approvalSubmissionsRelations = relations(approvalSubmissions, ({ one }) => ({
  card: one(cards, { fields: [approvalSubmissions.cardId], references: [cards.id] }),
  user: one(users, { fields: [approvalSubmissions.userId], references: [users.id] }),
}));
