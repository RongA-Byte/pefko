// Shared types for the ARCA fund platform

// ── Sectors ──────────────────────────────────────────────────────────
export const SECTORS = ['ai', 'space-aero', 'bio-medical'] as const
export type Sector = (typeof SECTORS)[number]

// ── Deal Pipeline ────────────────────────────────────────────────────
export const DEAL_STAGES = [
  'sourced',
  'first-meeting',
  'deep-dive',
  'ic-review',
  'term-sheet',
  'closed',
  'passed',
] as const
export type DealStage = (typeof DEAL_STAGES)[number]

// ── TRL (Technology Readiness Level) ─────────────────────────────────
export interface TrlScore {
  sector: Sector
  level: number // 1-9 for space/aero, custom scales for AI and bio
  notes: string
  assessedAt: Date
  assessedBy: string
}

export interface TrlCriterion {
  id: string
  name: string
  weight: number // 0-1, weights sum to 1 per level
  description: string
}

export interface TrlRubric {
  sector: Sector
  level: number
  label: string
  description: string
  criteria: TrlCriterion[]
}

export interface TrlCriterionScore {
  criterionId: string
  score: number // 0-10
  weight: number
  notes?: string
}

export interface TrlAssessment {
  id: string
  dealId: string
  assessorId: string
  sector: Sector
  overallLevel: number
  criteriaScores: TrlCriterionScore[]
  weightedScore: number
  notes?: string
}

// ── IC Memos & Voting ───────────────────────────────────────────────
export const MEMO_TYPES = ['sourcing-note', 'deep-dive', 'ic-memo', 'decision'] as const
export type MemoType = (typeof MEMO_TYPES)[number]

export const IC_VOTES = ['invest', 'pass', 'follow-up', 'abstain'] as const
export type IcVote = (typeof IC_VOTES)[number]

export interface DiligenceChecklistItem {
  id: string
  category: string
  item: string
  completed: boolean
  notes?: string
  assignee?: string
}

export interface IcMemo {
  id: string
  dealId: string
  type: MemoType
  title: string
  body: string
  authorId: string
  diligenceChecklist?: DiligenceChecklistItem[]
  decision?: IcVote
  version: number
}

export interface IcVoteRecord {
  id: string
  memoId: string
  voterId: string
  vote: IcVote
  rationale?: string
}

// ── Default TRL Rubric Labels ───────────────────────────────────────
export const TRL_LABELS: Record<number, string> = {
  1: 'Basic principles observed',
  2: 'Technology concept formulated',
  3: 'Experimental proof of concept',
  4: 'Technology validated in lab',
  5: 'Technology validated in relevant environment',
  6: 'Technology demonstrated in relevant environment',
  7: 'System prototype demonstrated',
  8: 'System complete and qualified',
  9: 'Actual system proven in operational environment',
}

// ── Sector-specific diligence templates ─────────────────────────────
export const DILIGENCE_TEMPLATES: Record<Sector, DiligenceChecklistItem[]> = {
  ai: [
    { id: 'ai-1', category: 'Technology', item: 'Model architecture review', completed: false },
    { id: 'ai-2', category: 'Technology', item: 'Training data provenance and licensing', completed: false },
    { id: 'ai-3', category: 'Technology', item: 'Benchmark performance vs. SOTA', completed: false },
    { id: 'ai-4', category: 'Technology', item: 'Inference cost and latency analysis', completed: false },
    { id: 'ai-5', category: 'Market', item: 'TAM/SAM/SOM analysis', completed: false },
    { id: 'ai-6', category: 'Market', item: 'Competitive landscape mapping', completed: false },
    { id: 'ai-7', category: 'Team', item: 'Technical founder background', completed: false },
    { id: 'ai-8', category: 'Team', item: 'Key hire plan and capacity', completed: false },
    { id: 'ai-9', category: 'Legal', item: 'IP ownership and freedom to operate', completed: false },
    { id: 'ai-10', category: 'Legal', item: 'AI regulatory compliance review', completed: false },
  ],
  'space-aero': [
    { id: 'sp-1', category: 'Technology', item: 'TRL assessment (NASA framework)', completed: false },
    { id: 'sp-2', category: 'Technology', item: 'Testing and qualification status', completed: false },
    { id: 'sp-3', category: 'Technology', item: 'Manufacturing readiness level', completed: false },
    { id: 'sp-4', category: 'Technology', item: 'Supply chain resilience', completed: false },
    { id: 'sp-5', category: 'Market', item: 'Government vs commercial revenue mix', completed: false },
    { id: 'sp-6', category: 'Market', item: 'Contract pipeline and LOIs', completed: false },
    { id: 'sp-7', category: 'Team', item: 'Aerospace domain expertise', completed: false },
    { id: 'sp-8', category: 'Team', item: 'Regulatory and compliance experience', completed: false },
    { id: 'sp-9', category: 'Legal', item: 'ITAR/EAR compliance', completed: false },
    { id: 'sp-10', category: 'Legal', item: 'Launch/spectrum licensing status', completed: false },
  ],
  'bio-medical': [
    { id: 'bm-1', category: 'Technology', item: 'Scientific validation status', completed: false },
    { id: 'bm-2', category: 'Technology', item: 'Clinical trial phase and timeline', completed: false },
    { id: 'bm-3', category: 'Technology', item: 'Platform vs single-product assessment', completed: false },
    { id: 'bm-4', category: 'Technology', item: 'Manufacturing scalability', completed: false },
    { id: 'bm-5', category: 'Market', item: 'Patient population and unmet need', completed: false },
    { id: 'bm-6', category: 'Market', item: 'Reimbursement pathway analysis', completed: false },
    { id: 'bm-7', category: 'Team', item: 'Scientific advisory board', completed: false },
    { id: 'bm-8', category: 'Team', item: 'Regulatory affairs experience', completed: false },
    { id: 'bm-9', category: 'Legal', item: 'Patent portfolio review', completed: false },
    { id: 'bm-10', category: 'Legal', item: 'FDA/EMA regulatory pathway', completed: false },
  ],
}

// ── LP Pipeline ─────────────────────────────────────────────────────
export const LP_PIPELINE_STAGES = [
  'prospecting',
  'intro-call',
  'data-room-access',
  'commitment',
  'closed',
] as const
export type LpPipelineStage = (typeof LP_PIPELINE_STAGES)[number]

// ── Co-Investors ────────────────────────────────────────────────────
export const CO_INVESTOR_TYPES = ['lead', 'co-lead', 'follow-on', 'strategic'] as const
export type CoInvestorType = (typeof CO_INVESTOR_TYPES)[number]

export interface CoInvestor {
  id: string
  dealId: string
  name: string
  type: CoInvestorType
  checkSize: string | null
  contactName: string | null
  contactEmail: string | null
  notes: string | null
}

export interface DealContact {
  id: string
  dealId: string
  name: string
  role: string
  email: string | null
  phone: string | null
  isPrimary: boolean
}

export interface DealSummary {
  id: string
  companyName: string
  sector: Sector
  stage: DealStage
  trlScore: number | null
  checkSize: string | null
  valuation: string | null
  leadPartner: string | null
  coInvestorCount: number
  createdAt: string
  updatedAt: string
}

export interface DealPipelineStats {
  totalDeals: number
  byStage: Record<string, number>
  bySector: Record<string, number>
  totalCheckSize: number
  averageTrl: number | null
  activeDeals: number
}

export interface LpPipelineEntry {
  id: string
  lpId: string
  lpName: string
  stage: LpPipelineStage
  commitmentTarget: string | null
  lastContactDate: string | null
  nextFollowUp: string | null
  notes: string | null
  createdAt: string
  updatedAt: string
}

// ── Investor / LP ────────────────────────────────────────────────────
export const LP_TYPES = [
  'family-office',
  'institutional',
  'sovereign-wealth',
  'strategic',
  'individual',
] as const
export type LpType = (typeof LP_TYPES)[number]

export const KYC_STATUSES = [
  'pending',
  'documents-submitted',
  'under-review',
  'approved',
  'rejected',
  'expired',
] as const
export type KycStatus = (typeof KYC_STATUSES)[number]

// ── AML/KYC Compliance (Steward Integration) ────────────────────────

export const SCREENING_TYPES = ['identity', 'ofac', 'pep', 'adverse-media', 'source-of-funds'] as const
export type ScreeningType = (typeof SCREENING_TYPES)[number]

export const SCREENING_RESULTS = ['clear', 'match', 'potential-match', 'pending', 'error'] as const
export type ScreeningResult = (typeof SCREENING_RESULTS)[number]

export const RISK_LEVELS = ['low', 'medium', 'high', 'critical'] as const
export type RiskLevel = (typeof RISK_LEVELS)[number]

export const DOCUMENT_TYPES = [
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
] as const
export type ComplianceDocumentType = (typeof DOCUMENT_TYPES)[number]

export const DOCUMENT_STATUSES = ['pending', 'uploaded', 'verified', 'rejected', 'expired'] as const
export type DocumentStatus = (typeof DOCUMENT_STATUSES)[number]

export const MONITORING_FREQUENCIES = ['daily', 'weekly', 'monthly', 'quarterly'] as const
export type MonitoringFrequency = (typeof MONITORING_FREQUENCIES)[number]

export interface KycScreeningRecord {
  id: string
  lpId: string
  screeningType: ScreeningType
  result: ScreeningResult
  riskLevel: RiskLevel | null
  provider: string
  providerReferenceId: string | null
  details: Record<string, unknown> | null
  screenedAt: string
}

export interface ComplianceDocument {
  id: string
  lpId: string
  documentType: ComplianceDocumentType
  fileName: string
  status: DocumentStatus
  notes: string | null
  expiresAt: string | null
  uploadedAt: string
  reviewedAt: string | null
  reviewedBy: string | null
}

export interface LpOnboardingPayload {
  name: string
  type: LpType
  contactEmail: string
  contactName: string
  location: string
  commitmentAmount?: string
}

export interface LpComplianceSummary {
  lpId: string
  lpName: string
  kycStatus: KycStatus
  riskLevel: RiskLevel | null
  screeningsPassed: number
  screeningsTotal: number
  documentsVerified: number
  documentsRequired: number
  lastScreenedAt: string | null
  nextReviewAt: string | null
}

// ── Data Room ───────────────────────────────────────────────────────

export const DATA_ROOM_FOLDER_TYPES = [
  'ppm',
  'lpa',
  'subscription-agreement',
  'side-letter',
  'ddq',
  'financials',
  'team',
  'legal',
  'other',
] as const
export type DataRoomFolderType = (typeof DATA_ROOM_FOLDER_TYPES)[number]

export const DATA_ROOM_FOLDER_LABELS: Record<DataRoomFolderType, string> = {
  ppm: 'Private Placement Memorandum',
  lpa: 'Limited Partnership Agreement',
  'subscription-agreement': 'Subscription Agreement',
  'side-letter': 'Side Letter Template',
  ddq: 'Due Diligence Questionnaire',
  financials: 'Fund Financials & Projections',
  team: 'Team Bios & Track Record',
  legal: 'Legal Documents',
  other: 'Other',
}

export const DATA_ROOM_ACCESS_LEVELS = ['none', 'view', 'download'] as const
export type DataRoomAccessLevel = (typeof DATA_ROOM_ACCESS_LEVELS)[number]

export interface DataRoomDocument {
  id: string
  folderId: string
  folderType: DataRoomFolderType
  name: string
  fileName: string
  fileSize: number | null
  mimeType: string | null
  version: number
  uploadedBy: string
  createdAt: string
  updatedAt: string
}

export interface DataRoomLpAccess {
  id: string
  lpId: string
  documentId: string | null
  folderType: DataRoomFolderType | null
  accessLevel: DataRoomAccessLevel
  ndaRequired: boolean
  ndaSignedAt: string | null
  expiresAt: string | null
  grantedBy: string
  createdAt: string
}

export interface DataRoomEngagement {
  lpId: string
  lpName: string
  documentName: string
  viewCount: number
  totalDuration: number
  completionRate: number
  lastViewedAt: string | null
  downloadedAt: string | null
}

// ── Fund Administration ─────────────────────────────────────────────

export const LP_ACCOUNT_STATUSES = ['invited', 'onboarding', 'active', 'inactive'] as const
export type LpAccountStatus = (typeof LP_ACCOUNT_STATUSES)[number]

export const LP_ACCOUNT_TYPES = ['individual', 'entity', 'trust'] as const
export type LpAccountType = (typeof LP_ACCOUNT_TYPES)[number]

export interface LpAccount {
  id: string
  name: string
  type: LpAccountType
  email: string
  commitmentAmount: number
  calledAmount: number
  distributedAmount: number
  nav: number
  status: LpAccountStatus
  createdAt: string
  updatedAt: string
}

export const CAPITAL_CALL_STATUSES = ['draft', 'sent', 'partially-paid', 'completed', 'overdue'] as const
export type CapitalCallStatus = (typeof CAPITAL_CALL_STATUSES)[number]

export interface CapitalCall {
  id: string
  callNumber: number
  totalAmount: number
  dueDate: string
  purpose: string
  status: CapitalCallStatus
  lineItems: CapitalCallLineItem[]
  createdAt: string
}

export interface CapitalCallLineItem {
  lpAccountId: string
  amount: number
  proRataPercentage: number
  status: 'pending' | 'paid' | 'overdue'
  paidAt: string | null
}

export const DISTRIBUTION_TYPES = ['return-of-capital', 'profit', 'recallable'] as const
export type DistributionType = (typeof DISTRIBUTION_TYPES)[number]

export const DISTRIBUTION_STATUSES = ['draft', 'approved', 'distributed'] as const
export type DistributionStatus = (typeof DISTRIBUTION_STATUSES)[number]

export interface Distribution {
  id: string
  distributionNumber: number
  totalAmount: number
  distributionDate: string
  type: DistributionType
  status: DistributionStatus
  lineItems: DistributionLineItem[]
  createdAt: string
}

export interface DistributionLineItem {
  lpAccountId: string
  amount: number
  proRataPercentage: number
}

export interface FundSummary {
  fundName: string
  vintage: number
  targetSize: number
  totalCommitments: number
  totalCalled: number
  totalDistributed: number
  nav: number
  lpCount: number
  pendingCapitalCalls: number
}

// ── Portfolio ────────────────────────────────────────────────────────

export const PORTFOLIO_STATUSES = ['active', 'exited', 'written-off'] as const
export type PortfolioStatus = (typeof PORTFOLIO_STATUSES)[number]

export interface PortfolioCompany {
  id: string
  dealId: string | null
  name: string
  sector: Sector
  investmentDate: string
  investmentAmount: string
  ownershipPct: number | null
  currentValuation: string | null
  trlScore: number | null
  trlDetails: Record<string, unknown> | null
  status: PortfolioStatus
  coInvestors: string[]
  kpis: PortfolioKpi[]
  createdAt: string
  updatedAt: string
}

export interface PortfolioKpi {
  id: string
  companyId: string
  period: string // e.g. "2026-Q1"
  revenue: string | null
  burnRate: string | null
  headcount: number | null
  customMetrics: Record<string, unknown>
  submittedAt: string
}

export interface PortfolioMetrics {
  tvpiGross: number
  tvpiNet: number
  dpi: number
  rvpi: number
  irr: number | null
  nav: number
  totalInvested: number
  totalDistributed: number
  unrealizedValue: number
}

export interface PortfolioSectorBreakdown {
  sector: Sector
  companyCount: number
  totalInvested: number
  currentValue: number
  avgTrl: number | null
}

// ── LP Reporting ────────────────────────────────────────────────────

export const REPORT_TYPES = ['quarterly', 'annual', 'capital-call', 'distribution', 'custom'] as const
export type ReportType = (typeof REPORT_TYPES)[number]

export const REPORT_STATUSES = ['draft', 'in-review', 'published'] as const
export type ReportStatus = (typeof REPORT_STATUSES)[number]

export interface QuarterlyReport {
  id: string
  period: string // e.g. "2026-Q1"
  type: ReportType
  status: ReportStatus
  fundMetrics: PortfolioMetrics
  sectorBreakdown: PortfolioSectorBreakdown[]
  portfolioUpdates: PortfolioUpdate[]
  marketCommentary: string | null
  createdAt: string
  updatedAt: string
  publishedAt: string | null
}

export interface PortfolioUpdate {
  companyId: string
  companyName: string
  sector: Sector
  trlProgress: { from: number; to: number } | null
  highlights: string[]
  risks: string[]
  nextMilestones: string[]
}

// ── API Response Envelope ────────────────────────────────────────────
export interface ApiResponse<T> {
  data: T
  meta?: {
    page?: number
    pageSize?: number
    total?: number
  }
}

export interface ApiError {
  error: string
  message: string
  statusCode: number
}
