import type { FastifyInstance } from 'fastify'
import type {
  KycStatus,
  KycScreeningRecord,
  ComplianceDocument,
  LpOnboardingPayload,
  LpComplianceSummary,
  ScreeningType,
  ScreeningResult,
  RiskLevel,
  DocumentStatus,
  ComplianceDocumentType,
  LpType,
  ComplianceJurisdiction,
} from '@arca/shared'
import { JURISDICTION_REQUIREMENTS, COMPLIANCE_JURISDICTIONS } from '@arca/shared'

// ── In-memory stores (until DB is connected) ────────────────────────

interface LpRecord {
  id: string
  name: string
  type: LpType
  contactEmail: string
  contactName: string
  location: string
  kycStatus: KycStatus
  kycProvider: string
  kycExternalId: string | null
  kycCompletedAt: string | null
  commitmentAmount: string | null
  createdAt: string
  updatedAt: string
}

const lps: LpRecord[] = []
const screenings: KycScreeningRecord[] = []
const documents: ComplianceDocument[] = []
const monitoringSchedules: {
  id: string
  lpId: string
  frequency: string
  lastRunAt: string | null
  nextRunAt: string | null
  isActive: boolean
}[] = []

// ── Helpers ─────────────────────────────────────────────────────────

function requiredDocumentsForType(lpType: LpType): ComplianceDocumentType[] {
  const common: ComplianceDocumentType[] = ['proof-of-address', 'source-of-funds-declaration']
  switch (lpType) {
    case 'individual':
      return ['passport', ...common, 'bank-statement']
    case 'family-office':
      return ['passport', ...common, 'bank-statement', 'beneficial-ownership']
    case 'institutional':
      return ['corporate-registration', ...common, 'beneficial-ownership']
    case 'sovereign-wealth':
      return ['corporate-registration', ...common]
    case 'strategic':
      return ['corporate-registration', ...common, 'beneficial-ownership']
    default:
      return ['passport', ...common]
  }
}

function computeComplianceSummary(lp: LpRecord): LpComplianceSummary {
  const lpScreenings = screenings.filter((s) => s.lpId === lp.id)
  const lpDocs = documents.filter((d) => d.lpId === lp.id)
  const required = requiredDocumentsForType(lp.type)

  const screeningsPassed = lpScreenings.filter((s) => s.result === 'clear').length
  const requiredScreeningTypes: ScreeningType[] = ['identity', 'ofac', 'pep', 'adverse-media', 'source-of-funds']

  const highestRisk = lpScreenings.reduce<RiskLevel | null>((max, s) => {
    if (!s.riskLevel) return max
    const order: Record<RiskLevel, number> = { low: 0, medium: 1, high: 2, critical: 3 }
    if (!max) return s.riskLevel
    return order[s.riskLevel] > order[max] ? s.riskLevel : max
  }, null)

  const lastScreened = lpScreenings.length
    ? lpScreenings.reduce((latest, s) => (s.screenedAt > latest ? s.screenedAt : latest), lpScreenings[0].screenedAt)
    : null

  const schedule = monitoringSchedules.find((m) => m.lpId === lp.id && m.isActive)

  return {
    lpId: lp.id,
    lpName: lp.name,
    kycStatus: lp.kycStatus,
    riskLevel: highestRisk,
    screeningsPassed,
    screeningsTotal: requiredScreeningTypes.length,
    documentsVerified: lpDocs.filter((d) => d.status === 'verified').length,
    documentsRequired: required.length,
    lastScreenedAt: lastScreened,
    nextReviewAt: schedule?.nextRunAt ?? null,
  }
}

// ── Routes ──────────────────────────────────────────────────────────

export async function complianceRoutes(app: FastifyInstance) {
  // ── LP Onboarding ─────────────────────────────────────────────────

  app.post('/api/v1/compliance/onboard', async (request) => {
    const body = request.body as LpOnboardingPayload
    const lp: LpRecord = {
      id: crypto.randomUUID(),
      name: body.name,
      type: body.type,
      contactEmail: body.contactEmail,
      contactName: body.contactName,
      location: body.location,
      kycStatus: 'pending',
      kycProvider: 'steward',
      kycExternalId: null,
      kycCompletedAt: null,
      commitmentAmount: body.commitmentAmount ?? null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    lps.push(lp)

    // Determine required documents for this LP type
    const requiredDocs = requiredDocumentsForType(body.type)

    // Create a monitoring schedule
    const schedule = {
      id: crypto.randomUUID(),
      lpId: lp.id,
      frequency: 'quarterly',
      lastRunAt: null,
      nextRunAt: null,
      isActive: true,
    }
    monitoringSchedules.push(schedule)

    return {
      data: {
        lp,
        requiredDocuments: requiredDocs,
        monitoringScheduleId: schedule.id,
      },
    }
  })

  // ── LP List with compliance summaries ─────────────────────────────

  app.get('/api/v1/compliance/lps', async (request) => {
    const { status } = request.query as { status?: KycStatus }
    let filtered = lps
    if (status) filtered = filtered.filter((lp) => lp.kycStatus === status)
    return { data: filtered.map(computeComplianceSummary) }
  })

  app.get('/api/v1/compliance/lps/:lpId', async (request) => {
    const { lpId } = request.params as { lpId: string }
    const lp = lps.find((l) => l.id === lpId)
    if (!lp) return { error: 'Not found', message: 'LP not found', statusCode: 404 }

    const lpScreenings = screenings.filter((s) => s.lpId === lpId)
    const lpDocs = documents.filter((d) => d.lpId === lpId)
    const schedule = monitoringSchedules.find((m) => m.lpId === lpId && m.isActive)
    const requiredDocs = requiredDocumentsForType(lp.type)

    return {
      data: {
        lp,
        summary: computeComplianceSummary(lp),
        screenings: lpScreenings,
        documents: lpDocs,
        requiredDocuments: requiredDocs,
        monitoringSchedule: schedule ?? null,
      },
    }
  })

  // ── KYC Screening ─────────────────────────────────────────────────

  app.post('/api/v1/compliance/lps/:lpId/screenings', async (request) => {
    const { lpId } = request.params as { lpId: string }
    const body = request.body as { screeningTypes: ScreeningType[] }
    const lp = lps.find((l) => l.id === lpId)
    if (!lp) return { error: 'Not found', message: 'LP not found', statusCode: 404 }

    // Update LP status to under-review
    lp.kycStatus = 'under-review'
    lp.updatedAt = new Date().toISOString()

    // Create screening records (in production these would be submitted to Steward)
    const newScreenings: KycScreeningRecord[] = body.screeningTypes.map((type) => ({
      id: crypto.randomUUID(),
      lpId,
      screeningType: type,
      result: 'pending' as ScreeningResult,
      riskLevel: null,
      provider: 'steward',
      providerReferenceId: null,
      details: null,
      screenedAt: new Date().toISOString(),
    }))

    screenings.push(...newScreenings)
    return { data: newScreenings }
  })

  app.get('/api/v1/compliance/lps/:lpId/screenings', async (request) => {
    const { lpId } = request.params as { lpId: string }
    const lpScreenings = screenings.filter((s) => s.lpId === lpId)
    return { data: lpScreenings }
  })

  app.patch('/api/v1/compliance/screenings/:screeningId', async (request) => {
    const { screeningId } = request.params as { screeningId: string }
    const body = request.body as {
      result: ScreeningResult
      riskLevel?: RiskLevel
      providerReferenceId?: string
      details?: Record<string, unknown>
    }

    const idx = screenings.findIndex((s) => s.id === screeningId)
    if (idx < 0) return { error: 'Not found', message: 'Screening not found', statusCode: 404 }

    screenings[idx] = {
      ...screenings[idx],
      ...body,
      screenedAt: new Date().toISOString(),
    }

    // Check if all screenings for this LP are complete
    const lpId = screenings[idx].lpId
    const lpScreenings = screenings.filter((s) => s.lpId === lpId)
    const allComplete = lpScreenings.every((s) => s.result !== 'pending')

    if (allComplete) {
      const lp = lps.find((l) => l.id === lpId)
      if (lp) {
        const hasMatch = lpScreenings.some((s) => s.result === 'match')
        const hasPotentialMatch = lpScreenings.some((s) => s.result === 'potential-match')
        const hasError = lpScreenings.some((s) => s.result === 'error')

        if (hasMatch) {
          lp.kycStatus = 'rejected'
        } else if (hasPotentialMatch || hasError) {
          lp.kycStatus = 'under-review'
        } else {
          lp.kycStatus = 'approved'
          lp.kycCompletedAt = new Date().toISOString()
        }
        lp.updatedAt = new Date().toISOString()
      }
    }

    return { data: screenings[idx] }
  })

  // ── Steward webhook callback ──────────────────────────────────────

  app.post('/api/v1/compliance/webhooks/steward', async (request) => {
    const body = request.body as {
      screeningId: string
      results: {
        screeningType: ScreeningType
        result: ScreeningResult
        riskLevel: RiskLevel | null
        details: Record<string, unknown>
      }[]
    }

    // Update each screening result from the webhook payload
    for (const result of body.results) {
      const screening = screenings.find(
        (s) => s.providerReferenceId === body.screeningId && s.screeningType === result.screeningType,
      )
      if (screening) {
        screening.result = result.result
        screening.riskLevel = result.riskLevel
        screening.details = result.details
        screening.screenedAt = new Date().toISOString()
      }
    }

    return { status: 'ok' }
  })

  // ── Document Management ───────────────────────────────────────────

  app.post('/api/v1/compliance/lps/:lpId/documents', async (request) => {
    const { lpId } = request.params as { lpId: string }
    const body = request.body as {
      documentType: ComplianceDocumentType
      fileName: string
    }
    const lp = lps.find((l) => l.id === lpId)
    if (!lp) return { error: 'Not found', message: 'LP not found', statusCode: 404 }

    const doc: ComplianceDocument = {
      id: crypto.randomUUID(),
      lpId,
      documentType: body.documentType,
      fileName: body.fileName,
      status: 'uploaded',
      notes: null,
      expiresAt: null,
      uploadedAt: new Date().toISOString(),
      reviewedAt: null,
      reviewedBy: null,
    }
    documents.push(doc)

    // Update LP status if first document submission
    if (lp.kycStatus === 'pending') {
      lp.kycStatus = 'documents-submitted'
      lp.updatedAt = new Date().toISOString()
    }

    return { data: doc }
  })

  app.get('/api/v1/compliance/lps/:lpId/documents', async (request) => {
    const { lpId } = request.params as { lpId: string }
    const lpDocs = documents.filter((d) => d.lpId === lpId)
    return { data: lpDocs }
  })

  app.patch('/api/v1/compliance/documents/:documentId', async (request) => {
    const { documentId } = request.params as { documentId: string }
    const body = request.body as {
      status: DocumentStatus
      notes?: string
      reviewedBy?: string
    }

    const idx = documents.findIndex((d) => d.id === documentId)
    if (idx < 0) return { error: 'Not found', message: 'Document not found', statusCode: 404 }

    documents[idx] = {
      ...documents[idx],
      ...body,
      reviewedAt: body.status === 'verified' || body.status === 'rejected' ? new Date().toISOString() : documents[idx].reviewedAt,
      reviewedBy: body.reviewedBy ?? documents[idx].reviewedBy,
    }

    return { data: documents[idx] }
  })

  // ── Dashboard Stats ───────────────────────────────────────────────

  app.get('/api/v1/compliance/dashboard', async () => {
    const total = lps.length
    const byStatus: Record<string, number> = {}
    for (const lp of lps) {
      byStatus[lp.kycStatus] = (byStatus[lp.kycStatus] ?? 0) + 1
    }

    const pendingReview = documents.filter((d) => d.status === 'uploaded').length
    const activeMonitoring = monitoringSchedules.filter((m) => m.isActive).length

    const highRiskCount = screenings.filter(
      (s) => s.riskLevel === 'high' || s.riskLevel === 'critical',
    ).length

    return {
      data: {
        totalLps: total,
        byStatus,
        pendingDocumentReview: pendingReview,
        activeMonitoring,
        highRiskScreenings: highRiskCount,
        recentScreenings: screenings
          .sort((a, b) => b.screenedAt.localeCompare(a.screenedAt))
          .slice(0, 10),
      },
    }
  })

  // ── Jurisdiction Requirements ─────────────────────────────────────

  app.get('/api/v1/compliance/jurisdictions', async () => {
    return { data: JURISDICTION_REQUIREMENTS }
  })

  app.get('/api/v1/compliance/jurisdictions/:jurisdiction', async (request) => {
    const { jurisdiction } = request.params as { jurisdiction: ComplianceJurisdiction }
    const req = JURISDICTION_REQUIREMENTS[jurisdiction]
    if (!req) return { error: 'Not found', message: 'Unknown jurisdiction', statusCode: 404 }
    return { data: { jurisdiction, ...req } }
  })

  // ── Jurisdiction Compliance Check ─────────────────────────────────

  app.get('/api/v1/compliance/lps/:lpId/jurisdiction-status', async (request) => {
    const { lpId } = request.params as { lpId: string }
    const lp = lps.find((l) => l.id === lpId)
    if (!lp) return { error: 'Not found', message: 'LP not found', statusCode: 404 }

    const lpScreenings = screenings.filter((s) => s.lpId === lpId)
    const results: Record<string, { compliant: boolean; screeningsCompleted: string[]; screeningsMissing: string[]; notes: string }> = {}

    for (const [jurisdiction, req] of Object.entries(JURISDICTION_REQUIREMENTS)) {
      const completed = req.requiredScreenings.filter((type) =>
        lpScreenings.some((s) => s.screeningType === type && s.result === 'clear'),
      )
      const missing = req.requiredScreenings.filter((type) =>
        !lpScreenings.some((s) => s.screeningType === type && s.result === 'clear'),
      )
      results[jurisdiction] = {
        compliant: missing.length === 0,
        screeningsCompleted: completed,
        screeningsMissing: missing,
        notes: req.notes,
      }
    }

    return { data: { lpId, lpName: lp.name, jurisdictions: results } }
  })

  // ── OFAC Sanctions Check ──────────────────────────────────────────

  app.post('/api/v1/compliance/lps/:lpId/ofac-check', async (request) => {
    const { lpId } = request.params as { lpId: string }
    const lp = lps.find((l) => l.id === lpId)
    if (!lp) return { error: 'Not found', message: 'LP not found', statusCode: 404 }

    const screening: KycScreeningRecord = {
      id: crypto.randomUUID(),
      lpId,
      screeningType: 'ofac',
      result: 'pending',
      riskLevel: null,
      provider: 'steward',
      providerReferenceId: null,
      details: { type: 'ofac-sdn-check', initiatedAt: new Date().toISOString() },
      screenedAt: new Date().toISOString(),
    }
    screenings.push(screening)
    return { data: screening }
  })

  // ── PEP (Politically Exposed Persons) Check ───────────────────────

  app.post('/api/v1/compliance/lps/:lpId/pep-check', async (request) => {
    const { lpId } = request.params as { lpId: string }
    const lp = lps.find((l) => l.id === lpId)
    if (!lp) return { error: 'Not found', message: 'LP not found', statusCode: 404 }

    const screening: KycScreeningRecord = {
      id: crypto.randomUUID(),
      lpId,
      screeningType: 'pep',
      result: 'pending',
      riskLevel: null,
      provider: 'steward',
      providerReferenceId: null,
      details: { type: 'pep-screening', initiatedAt: new Date().toISOString() },
      screenedAt: new Date().toISOString(),
    }
    screenings.push(screening)
    return { data: screening }
  })
}
