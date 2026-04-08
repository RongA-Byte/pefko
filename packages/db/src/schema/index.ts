import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  integer,
  numeric,
  jsonb,
  pgEnum,
  boolean,
  real,
} from 'drizzle-orm/pg-core'

// ── Enums ────────────────────────────────────────────────────────────

export const sectorEnum = pgEnum('sector', ['ai', 'space-aero', 'bio-medical'])

export const dealStageEnum = pgEnum('deal_stage', [
  'sourced',
  'first-meeting',
  'deep-dive',
  'ic-review',
  'term-sheet',
  'closed',
  'passed',
])

export const kycStatusEnum = pgEnum('kyc_status', [
  'pending',
  'documents-submitted',
  'under-review',
  'approved',
  'rejected',
  'expired',
])

export const lpTypeEnum = pgEnum('lp_type', [
  'family-office',
  'institutional',
  'sovereign-wealth',
  'strategic',
  'individual',
])

export const memoTypeEnum = pgEnum('memo_type', [
  'sourcing-note',
  'deep-dive',
  'ic-memo',
  'decision',
])

export const icVoteEnum = pgEnum('ic_vote', ['invest', 'pass', 'follow-up', 'abstain'])

// ── Users (internal team) ────────────────────────────────────────────

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  clerkId: varchar('clerk_id', { length: 255 }).unique().notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  role: varchar('role', { length: 50 }).notNull(), // gp, ic-member, analyst, compliance
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// ── Deals (pipeline) ─────────────────────────────────────────────────

export const deals = pgTable('deals', {
  id: uuid('id').defaultRandom().primaryKey(),
  companyName: varchar('company_name', { length: 255 }).notNull(),
  sector: sectorEnum('sector').notNull(),
  stage: dealStageEnum('stage').notNull().default('sourced'),
  description: text('description'),
  website: varchar('website', { length: 500 }),
  location: varchar('location', { length: 255 }),
  foundedYear: integer('founded_year'),
  trlScore: integer('trl_score'), // 1-9
  trlDetails: jsonb('trl_details'), // sector-specific scoring breakdown
  checkSize: numeric('check_size', { precision: 14, scale: 2 }),
  valuation: numeric('valuation', { precision: 14, scale: 2 }),
  leadPartner: uuid('lead_partner').references(() => users.id),
  affinityId: varchar('affinity_id', { length: 255 }), // external CRM reference
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// ── IC Memos ─────────────────────────────────────────────────────────

export const icMemos = pgTable('ic_memos', {
  id: uuid('id').defaultRandom().primaryKey(),
  dealId: uuid('deal_id')
    .references(() => deals.id)
    .notNull(),
  type: varchar('type', { length: 50 }).notNull(), // sourcing-note, deep-dive, ic-memo, decision
  title: varchar('title', { length: 500 }).notNull(),
  body: text('body').notNull(),
  authorId: uuid('author_id')
    .references(() => users.id)
    .notNull(),
  diligenceChecklist: jsonb('diligence_checklist'), // configurable per sector
  decision: varchar('decision', { length: 50 }), // invest, pass, follow-up
  version: integer('version').notNull().default(1),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// ── TRL Rubrics (sector-specific scoring criteria) ──────────────────

export const trlRubrics = pgTable('trl_rubrics', {
  id: uuid('id').defaultRandom().primaryKey(),
  sector: sectorEnum('sector').notNull(),
  level: integer('level').notNull(), // 1-9
  label: varchar('label', { length: 255 }).notNull(),
  description: text('description').notNull(),
  criteria: jsonb('criteria').notNull(), // array of { criterion, weight, description }
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// ── TRL Assessments (individual deal scoring) ───────────────────────

export const trlAssessments = pgTable('trl_assessments', {
  id: uuid('id').defaultRandom().primaryKey(),
  dealId: uuid('deal_id')
    .references(() => deals.id)
    .notNull(),
  assessorId: uuid('assessor_id')
    .references(() => users.id)
    .notNull(),
  sector: sectorEnum('sector').notNull(),
  overallLevel: integer('overall_level').notNull(), // 1-9
  criteriaScores: jsonb('criteria_scores').notNull(), // { criterionId, score, weight, notes }[]
  weightedScore: real('weighted_score').notNull(),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// ── IC Votes ────────────────────────────────────────────────────────

export const icVotes = pgTable('ic_votes', {
  id: uuid('id').defaultRandom().primaryKey(),
  memoId: uuid('memo_id')
    .references(() => icMemos.id)
    .notNull(),
  voterId: uuid('voter_id')
    .references(() => users.id)
    .notNull(),
  vote: icVoteEnum('vote').notNull(),
  rationale: text('rationale'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// ── LPs (investors) ──────────────────────────────────────────────────

export const lps = pgTable('lps', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  type: lpTypeEnum('type').notNull(),
  contactEmail: varchar('contact_email', { length: 255 }),
  contactName: varchar('contact_name', { length: 255 }),
  location: varchar('location', { length: 255 }),
  kycStatus: kycStatusEnum('kyc_status').notNull().default('pending'),
  kycProvider: varchar('kyc_provider', { length: 100 }), // flow, steward, etc.
  kycExternalId: varchar('kyc_external_id', { length: 255 }),
  kycCompletedAt: timestamp('kyc_completed_at'),
  commitmentAmount: numeric('commitment_amount', { precision: 14, scale: 2 }),
  affinityId: varchar('affinity_id', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// ── Portfolio Companies ──────────────────────────────────────────────

export const portfolioCompanies = pgTable('portfolio_companies', {
  id: uuid('id').defaultRandom().primaryKey(),
  dealId: uuid('deal_id').references(() => deals.id),
  name: varchar('name', { length: 255 }).notNull(),
  sector: sectorEnum('sector').notNull(),
  investmentDate: timestamp('investment_date').notNull(),
  investmentAmount: numeric('investment_amount', { precision: 14, scale: 2 }).notNull(),
  ownershipPct: numeric('ownership_pct', { precision: 5, scale: 2 }),
  currentValuation: numeric('current_valuation', { precision: 14, scale: 2 }),
  trlScore: integer('trl_score'),
  trlDetails: jsonb('trl_details'),
  status: varchar('status', { length: 50 }).notNull().default('active'), // active, exited, written-off
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// ── Audit Log ────────────────────────────────────────────────────────

export const auditLog = pgTable('audit_log', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id),
  action: varchar('action', { length: 100 }).notNull(),
  entityType: varchar('entity_type', { length: 100 }).notNull(),
  entityId: uuid('entity_id'),
  details: jsonb('details'),
  ipAddress: varchar('ip_address', { length: 45 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})
