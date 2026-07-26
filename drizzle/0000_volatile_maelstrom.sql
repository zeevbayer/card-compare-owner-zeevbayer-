CREATE TYPE "public"."approval_status" AS ENUM('pending', 'approved', 'rejected');--> statement-breakpoint
CREATE TYPE "public"."card_type" AS ENUM('personal', 'business', 'business_reports_personal', 'secured');--> statement-breakpoint
CREATE TYPE "public"."credit_bureau" AS ENUM('experian', 'transunion', 'equifax');--> statement-breakpoint
CREATE TYPE "public"."credit_score_tier" AS ENUM('excellent', 'good', 'fair', 'building');--> statement-breakpoint
CREATE TYPE "public"."rewards_program_type" AS ENUM('bank_points', 'airline', 'hotel', 'store', 'cash_back', 'fuel', 'cruise', 'retail_loyalty', 'credit_union', 'crypto');--> statement-breakpoint
CREATE TABLE "approval_submissions" (
	"id" serial PRIMARY KEY NOT NULL,
	"card_id" integer NOT NULL,
	"user_id" integer,
	"approved" boolean NOT NULL,
	"credit_score" integer,
	"credit_limit" numeric(10, 2),
	"bureau" "credit_bureau",
	"state" varchar(2),
	"annual_income" numeric(12, 2),
	"credit_history_years" numeric(4, 1),
	"notes" text,
	"display_name" varchar(60),
	"status" "approval_status" DEFAULT 'pending' NOT NULL,
	"submitted_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "article_related_cards" (
	"article_id" integer NOT NULL,
	"card_id" integer NOT NULL,
	CONSTRAINT "article_related_cards_article_id_card_id_pk" PRIMARY KEY("article_id","card_id")
);
--> statement-breakpoint
CREATE TABLE "articles" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" varchar(160) NOT NULL,
	"title" varchar(200) NOT NULL,
	"description" text NOT NULL,
	"body" text NOT NULL,
	"topic_id" integer NOT NULL,
	"youtube_id" varchar(40),
	"publish_date" date NOT NULL,
	"last_updated" date NOT NULL,
	CONSTRAINT "articles_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "benefits" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" varchar(80) NOT NULL,
	"label" varchar(160) NOT NULL,
	"description" text,
	CONSTRAINT "benefits_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "card_benefits" (
	"card_id" integer NOT NULL,
	"benefit_id" integer NOT NULL,
	"details" text,
	CONSTRAINT "card_benefits_card_id_benefit_id_pk" PRIMARY KEY("card_id","benefit_id")
);
--> statement-breakpoint
CREATE TABLE "card_credits" (
	"id" serial PRIMARY KEY NOT NULL,
	"card_id" integer NOT NULL,
	"label" varchar(160) NOT NULL,
	"value_amount" numeric(8, 2),
	"frequency" varchar(40),
	"enrollment_required" boolean DEFAULT false NOT NULL,
	"eligible_merchant" varchar(160),
	"redemption_conditions" text
);
--> statement-breakpoint
CREATE TABLE "card_reward_rates" (
	"card_id" integer NOT NULL,
	"category_id" integer NOT NULL,
	"rate_pct" numeric(5, 2),
	"cap" text,
	"notes" text,
	CONSTRAINT "card_reward_rates_card_id_category_id_pk" PRIMARY KEY("card_id","category_id")
);
--> statement-breakpoint
CREATE TABLE "cards" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" varchar(120) NOT NULL,
	"name" varchar(160) NOT NULL,
	"issuer_id" integer NOT NULL,
	"rewards_program_id" integer,
	"card_type" "card_type" DEFAULT 'personal' NOT NULL,
	"credit_score_tier" "credit_score_tier" NOT NULL,
	"annual_fee" numeric(8, 2),
	"purchase_apr_min" numeric(5, 2),
	"purchase_apr_max" numeric(5, 2),
	"intro_apr" numeric(5, 2),
	"intro_apr_months" integer,
	"is_deferred_interest" boolean DEFAULT false NOT NULL,
	"balance_transfer_fee_pct" numeric(5, 2),
	"foreign_transaction_fee_pct" numeric(5, 2),
	"welcome_offer_description" text,
	"welcome_offer_estimated_value" numeric(10, 2),
	"welcome_offer_spend_requirement" numeric(10, 2),
	"welcome_offer_window" varchar(80),
	"overview" text,
	"best_for" text,
	"likely_credit_bureau" "credit_bureau",
	"application_notes" text,
	"reconsideration_phone" varchar(40),
	"application_status_phone" varchar(40),
	"instant_card_number" boolean,
	"expedited_shipping_available" boolean,
	"image_url" text,
	"affiliate_url" text,
	"issuer_url" text NOT NULL,
	"last_verified" date,
	"offer_verified" date,
	"expires_on" date,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "cards_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "issuers" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" varchar(80) NOT NULL,
	"name" varchar(120) NOT NULL,
	"url" text NOT NULL,
	CONSTRAINT "issuers_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "reward_categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" varchar(80) NOT NULL,
	"label" varchar(120) NOT NULL,
	CONSTRAINT "reward_categories_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "rewards_programs" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" varchar(80) NOT NULL,
	"label" varchar(120) NOT NULL,
	"type" "rewards_program_type" NOT NULL,
	CONSTRAINT "rewards_programs_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "topics" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" varchar(80) NOT NULL,
	"label" varchar(120) NOT NULL,
	CONSTRAINT "topics_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	"name" varchar(160),
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "approval_submissions" ADD CONSTRAINT "approval_submissions_card_id_cards_id_fk" FOREIGN KEY ("card_id") REFERENCES "public"."cards"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "approval_submissions" ADD CONSTRAINT "approval_submissions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "article_related_cards" ADD CONSTRAINT "article_related_cards_article_id_articles_id_fk" FOREIGN KEY ("article_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "article_related_cards" ADD CONSTRAINT "article_related_cards_card_id_cards_id_fk" FOREIGN KEY ("card_id") REFERENCES "public"."cards"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "articles" ADD CONSTRAINT "articles_topic_id_topics_id_fk" FOREIGN KEY ("topic_id") REFERENCES "public"."topics"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "card_benefits" ADD CONSTRAINT "card_benefits_card_id_cards_id_fk" FOREIGN KEY ("card_id") REFERENCES "public"."cards"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "card_benefits" ADD CONSTRAINT "card_benefits_benefit_id_benefits_id_fk" FOREIGN KEY ("benefit_id") REFERENCES "public"."benefits"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "card_credits" ADD CONSTRAINT "card_credits_card_id_cards_id_fk" FOREIGN KEY ("card_id") REFERENCES "public"."cards"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "card_reward_rates" ADD CONSTRAINT "card_reward_rates_card_id_cards_id_fk" FOREIGN KEY ("card_id") REFERENCES "public"."cards"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "card_reward_rates" ADD CONSTRAINT "card_reward_rates_category_id_reward_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."reward_categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cards" ADD CONSTRAINT "cards_issuer_id_issuers_id_fk" FOREIGN KEY ("issuer_id") REFERENCES "public"."issuers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cards" ADD CONSTRAINT "cards_rewards_program_id_rewards_programs_id_fk" FOREIGN KEY ("rewards_program_id") REFERENCES "public"."rewards_programs"("id") ON DELETE no action ON UPDATE no action;