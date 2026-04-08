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

// ── KYC Screening Records ───────────────────────────────────────────

export const screeningTypeEnum = pgEnum('screening_type', [
  'identity',
  'ofac',
  'pep',
  'adverse-media',
  'source-of-funds',
])

export const screeningResultEnum = pgEnum('screening_result', [
  'clear',
  'match',
  'potential-match',
  'pending',
  'error',
])

export const riskLevelEnum = pgEnum('risk_level', ['low', 'medium', 'high', 'critical'])

export const kycScreenings = pgTable('kyc_screenings', {
  id: uuid('id').defaultRandom().primaryKey(),
  lpId: uuid('lp_id')
    .references(() => lps.id)
    .notNull(),
  screeningType: screeningTypeEnum('screening_type').notNull(),
  result: screeningResultEnum('result').notNull().default('pending'),
  riskLevel: riskLevelEnum('risk_level'),
  provider: varchar('provider', { length: 100 }).notNull().default('steward'),
  providerReferenceId: varchar('provider_reference_id', { length: 255 }),
  details: jsonb('details'),
  screenedAt: timestamp('screened_at').defaultNow().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// ── Compliance Documents ────────────────────────────────────────────

export const documentTypeEnum = pgEnum('document_type', [
  'passport',
  'drivers-license',
  'national-id',
  'proof-of-address',
  'source-of-funds-declaration',
  'bank-statement',
  'tax-return',
  'corporate-registration',
  'trust-deed',
  'beneficial-ownership',
])

export const documentStatusEnum = pgEnum('document_status', [
  'pending',
  'uploaded',
  'verified',
  'rejected',
  'expired',
])

export const complianceDocuments = pgTable('compliance_documents', {
  id: uuid('id').defaultRandom().primaryKey(),
  lpId: uuid('lp_id')
    .references(() => lps.id)
    .notNull(),
  documentType: documentTypeEnum('document_type').notNull(),
  fileName: varchar('file_name', { length: 500 }).notNull(),
  fileUrl: varchar('file_url', { length: 1000 }),
  status: documentStatusEnum('status').notNull().default('pending'),
  notes: text('notes'),
  expiresAt: timestamp('expires_at'),
  uploadedAt: timestamp('uploaded_at').defaultNow().notNull(),
  reviewedAt: timestamp('reviewed_at'),
  reviewedBy: uuid('reviewed_by').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// ── Monitoring Schedule ─────────────────────────────────────────────

export const monitoringFrequencyEnum = pgEnum('monitoring_frequency', [
  'daily',
  'weekly',
  'monthly',
  'quarterly',
])

export const monitoringSchedule = pgTable('monitoring_schedule', {
  id: uuid('id').defaultRandom().primaryKey(),
  lpId: uuid('lp_id')
    .references(() => lps.id)
    .notNull(),
  frequency: monitoringFrequencyEnum('frequency').notNull().default('quarterly'),
  lastRunAt: timestamp('last_run_at'),
  nextRunAt: timestamp('next_run_at'),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// ── Data Room ────────────────────────────────────────────────────────

export const dataRoomFolderTypeEnum = pgEnum('data_room_folder_type', [
  'ppm',
  'lpa',
  'subscription-agreement',
  'side-letter',
  'ddq',
  'financials',
  'team',
  'legal',
  'other',
])

export const dataRoomAccessLevelEnum = pgEnum('data_room_access_level', [
  'none',
  'view',
  'download',
])

export const dataRoomDocuments = pgTable('data_room_documents', {
  id: uuid('id').defaultRandom().primaryKey(),
  folderType: dataRoomFolderTypeEnum('folder_type').notNull(),
  name: varchar('name', { length: 500 }).notNull(),
  fileName: varchar('file_name', { length: 500 }).notNull(),
  fileUrl: varchar('file_url', { length: 1000 }),
  version: integer('version').notNull().default(1),
  docSendDocumentId: varchar('docsend_document_id', { length: 255 }),
  uploadedBy: uuid('uploaded_by').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const dataRoomLpAccess = pgTable('data_room_lp_access', {
  id: uuid('id').defaultRandom().primaryKey(),
  lpId: uuid('lp_id')
    .references(() => lps.id)
    .notNull(),
  documentId: uuid('document_id').references(() => dataRoomDocuments.id),
  folderType: dataRoomFolderTypeEnum('folder_type'),
  accessLevel: dataRoomAccessLevelEnum('access_level').notNull().default('view'),
  ndaRequired: boolean('nda_required').notNull().default(true),
  ndaSignedAt: timestamp('nda_signed_at'),
  docSendLinkId: varchar('docsend_link_id', { length: 255 }),
  expiresAt: timestamp('expires_at'),
  grantedBy: uuid('granted_by').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const dataRoomEngagement = pgTable('data_room_engagement', {
  id: uuid('id').defaultRandom().primaryKey(),
  lpId: uuid('lp_id')
    .references(() => lps.id)
    .notNull(),
  documentId: uuid('document_id')
    .references(() => dataRoomDocuments.id)
    .notNull(),
  viewCount: integer('view_count').notNull().default(0),
  totalDuration: integer('total_duration').notNull().default(0),
  completionRate: real('completion_rate').notNull().default(0),
  lastViewedAt: timestamp('last_viewed_at'),
  downloadedAt: timestamp('downloaded_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// ── Fund Administration ──────────────────────────────────────────────

export const capitalCallStatusEnum = pgEnum('capital_call_status', [
  'draft',
  'sent',
  'partially-paid',
  'completed',
  'overdue',
])

export const capitalCalls = pgTable('capital_calls', {
  id: uuid('id').defaultRandom().primaryKey(),
  callNumber: integer('call_number').notNull(),
  totalAmount: numeric('total_amount', { precision: 14, scale: 2 }).notNull(),
  dueDate: timestamp('due_date').notNull(),
  purpose: text('purpose'),
  status: capitalCallStatusEnum('status').notNull().default('draft'),
  cartaCapitalCallId: varchar('carta_capital_call_id', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const capitalCallLineItems = pgTable('capital_call_line_items', {
  id: uuid('id').defaultRandom().primaryKey(),
  capitalCallId: uuid('capital_call_id')
    .references(() => capitalCalls.id)
    .notNull(),
  lpId: uuid('lp_id')
    .references(() => lps.id)
    .notNull(),
  amount: numeric('amount', { precision: 14, scale: 2 }).notNull(),
  proRataPercentage: real('pro_rata_percentage').notNull(),
  status: varchar('status', { length: 50 }).notNull().default('pending'),
  paidAt: timestamp('paid_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const distributionTypeEnum = pgEnum('distribution_type', [
  'return-of-capital',
  'profit',
  'recallable',
])

export const distributions = pgTable('distributions', {
  id: uuid('id').defaultRandom().primaryKey(),
  distributionNumber: integer('distribution_number').notNull(),
  totalAmount: numeric('total_amount', { precision: 14, scale: 2 }).notNull(),
  distributionDate: timestamp('distribution_date').notNull(),
  type: distributionTypeEnum('type').notNull(),
  status: varchar('status', { length: 50 }).notNull().default('draft'),
  cartaDistributionId: varchar('carta_distribution_id', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const distributionLineItems = pgTable('distribution_line_items', {
  id: uuid('id').defaultRandom().primaryKey(),
  distributionId: uuid('distribution_id')
    .references(() => distributions.id)
    .notNull(),
  lpId: uuid('lp_id')
    .references(() => lps.id)
    .notNull(),
  amount: numeric('amount', { precision: 14, scale: 2 }).notNull(),
  proRataPercentage: real('pro_rata_percentage').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// ── Co-Investors ────────────────────────────────────────────────────

export const coInvestorTypeEnum = pgEnum('co_investor_type', [
  'lead',
  'co-lead',
  'follow-on',
  'strategic',
])

export const coInvestors = pgTable('co_investors', {
  id: uuid('id').defaultRandom().primaryKey(),
  dealId: uuid('deal_id')
    .references(() => deals.id)
    .notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  type: coInvestorTypeEnum('type').notNull(),
  checkSize: numeric('check_size', { precision: 14, scale: 2 }),
  contactName: varchar('contact_name', { length: 255 }),
  contactEmail: varchar('contact_email', { length: 255 }),
  affinityOrgId: integer('affinity_org_id'),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// ── Deal Contacts ───────────────────────────────────────────────────

export const dealContacts = pgTable('deal_contacts', {
  id: uuid('id').defaultRandom().primaryKey(),
  dealId: uuid('deal_id')
    .references(() => deals.id)
    .notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  role: varchar('role', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }),
  phone: varchar('phone', { length: 50 }),
  affinityPersonId: integer('affinity_person_id'),
  isPrimary: boolean('is_primary').notNull().default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// ── LP Pipeline (CRM tracking) ──────────────────────────────────────

export const lpPipelineStageEnum = pgEnum('lp_pipeline_stage', [
  'prospecting',
  'intro-call',
  'data-room-access',
  'commitment',
  'closed',
])

export const lpPipeline = pgTable('lp_pipeline', {
  id: uuid('id').defaultRandom().primaryKey(),
  lpId: uuid('lp_id')
    .references(() => lps.id)
    .notNull(),
  stage: lpPipelineStageEnum('stage').notNull().default('prospecting'),
  commitmentTarget: numeric('commitment_target', { precision: 14, scale: 2 }),
  lastContactDate: timestamp('last_contact_date'),
  nextFollowUp: timestamp('next_follow_up'),
  notes: text('notes'),
  affinityOrgId: integer('affinity_org_id'),
  affinityListEntryId: integer('affinity_list_entry_id'),
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
