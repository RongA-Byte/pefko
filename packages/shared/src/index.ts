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

// ── Portfolio ────────────────────────────────────────────────────────
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
