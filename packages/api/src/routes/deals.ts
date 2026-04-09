import type { FastifyInstance } from 'fastify'
import type { DealStage, Sector } from '@arca/shared'
import { DEAL_STAGES, LP_PIPELINE_STAGES } from '@arca/shared'

// ── In-memory stores (until DB is connected) ────────────────────────

interface Deal {
  id: string
  companyName: string
  sector: Sector
  stage: DealStage
  description: string | null
  website: string | null
  location: string | null
  foundedYear: number | null
  trlScore: number | null
  trlDetails: Record<string, unknown> | null
  checkSize: string | null
  valuation: string | null
  leadPartner: string | null
  coInvestors: CoInvestor[]
  contacts: DealContact[]


  createdAt: string
  updatedAt: string
}

interface CoInvestor {
  id: string
  dealId: string
  name: string
  type: 'lead' | 'co-lead' | 'follow-on' | 'strategic'
  checkSize: string | null
  contactName: string | null
  contactEmail: string | null

  notes: string | null
}

interface DealContact {
  id: string
  dealId: string
  name: string
  role: string
  email: string | null
  phone: string | null

  isPrimary: boolean
}

interface LpPipelineEntry {
  id: string
  lpId: string
  lpName: string
  stage: string
  commitmentTarget: string | null
  lastContactDate: string | null
  nextFollowUp: string | null
  notes: string | null


  createdAt: string
  updatedAt: string
}

const deals: Deal[] = []
const coInvestors: CoInvestor[] = []
const dealContacts: DealContact[] = []
const lpPipeline: LpPipelineEntry[] = []

// ── Routes ──────────────────────────────────────────────────────────

export async function dealRoutes(app: FastifyInstance) {
  // ── Deal CRUD ─────────────────────────────────────────────────────

  app.get('/api/v1/deals', async (request) => {
    const { stage, sector, search } = request.query as {
      stage?: DealStage
      sector?: Sector
      search?: string
    }

    let filtered = deals
    if (stage) filtered = filtered.filter((d) => d.stage === stage)
    if (sector) filtered = filtered.filter((d) => d.sector === sector)
    if (search) {
      const q = search.toLowerCase()
      filtered = filtered.filter(
        (d) =>
          d.companyName.toLowerCase().includes(q) ||
          d.description?.toLowerCase().includes(q),
      )
    }

    return { data: filtered }
  })

  app.get('/api/v1/deals/:dealId', async (request) => {
    const { dealId } = request.params as { dealId: string }
    const deal = deals.find((d) => d.id === dealId)
    if (!deal) return { error: 'Not found', message: 'Deal not found', statusCode: 404 }

    return {
      data: {
        ...deal,
        coInvestors: coInvestors.filter((c) => c.dealId === dealId),
        contacts: dealContacts.filter((c) => c.dealId === dealId),
      },
    }
  })

  app.post('/api/v1/deals', async (request) => {
    const body = request.body as {
      companyName: string
      sector: Sector
      stage?: DealStage
      description?: string
      website?: string
      location?: string
      foundedYear?: number
      checkSize?: string
      valuation?: string
      leadPartner?: string
    }

    const deal: Deal = {
      id: crypto.randomUUID(),
      companyName: body.companyName,
      sector: body.sector,
      stage: body.stage ?? 'sourced',
      description: body.description ?? null,
      website: body.website ?? null,
      location: body.location ?? null,
      foundedYear: body.foundedYear ?? null,
      trlScore: null,
      trlDetails: null,
      checkSize: body.checkSize ?? null,
      valuation: body.valuation ?? null,
      leadPartner: body.leadPartner ?? null,
      coInvestors: [],
      contacts: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    deals.push(deal)
    return { data: deal }
  })

  app.patch('/api/v1/deals/:dealId', async (request) => {
    const { dealId } = request.params as { dealId: string }
    const body = request.body as Partial<
      Pick<
        Deal,
        | 'companyName'
        | 'sector'
        | 'stage'
        | 'description'
        | 'website'
        | 'location'
        | 'foundedYear'
        | 'checkSize'
        | 'valuation'
        | 'leadPartner'
        | 'trlScore'
        | 'trlDetails'
      >
    >

    const idx = deals.findIndex((d) => d.id === dealId)
    if (idx < 0) return { error: 'Not found', message: 'Deal not found', statusCode: 404 }

    deals[idx] = { ...deals[idx], ...body, updatedAt: new Date().toISOString() }
    return { data: deals[idx] }
  })

  app.delete('/api/v1/deals/:dealId', async (request) => {
    const { dealId } = request.params as { dealId: string }
    const idx = deals.findIndex((d) => d.id === dealId)
    if (idx < 0) return { error: 'Not found', message: 'Deal not found', statusCode: 404 }

    deals.splice(idx, 1)
    return { status: 'ok' }
  })

  // ── Stage Transitions ─────────────────────────────────────────────

  app.post('/api/v1/deals/:dealId/advance', async (request) => {
    const { dealId } = request.params as { dealId: string }
    const idx = deals.findIndex((d) => d.id === dealId)
    if (idx < 0) return { error: 'Not found', message: 'Deal not found', statusCode: 404 }

    const deal = deals[idx]
    const currentIndex = DEAL_STAGES.indexOf(deal.stage)
    if (currentIndex < 0 || currentIndex >= DEAL_STAGES.length - 2) {
      // Can't advance past 'closed'; 'passed' is a terminal state
      return { error: 'Invalid', message: 'Cannot advance deal from current stage', statusCode: 400 }
    }

    const nextStage = DEAL_STAGES[currentIndex + 1]
    deals[idx] = { ...deal, stage: nextStage, updatedAt: new Date().toISOString() }
    return { data: deals[idx] }
  })

  app.post('/api/v1/deals/:dealId/pass', async (request) => {
    const { dealId } = request.params as { dealId: string }
    const body = request.body as { reason?: string }

    const idx = deals.findIndex((d) => d.id === dealId)
    if (idx < 0) return { error: 'Not found', message: 'Deal not found', statusCode: 404 }

    deals[idx] = {
      ...deals[idx],
      stage: 'passed',
      updatedAt: new Date().toISOString(),
    }
    return { data: deals[idx] }
  })

  // ── Co-Investor Management ────────────────────────────────────────

  app.get('/api/v1/deals/:dealId/co-investors', async (request) => {
    const { dealId } = request.params as { dealId: string }
    return { data: coInvestors.filter((c) => c.dealId === dealId) }
  })

  app.post('/api/v1/deals/:dealId/co-investors', async (request) => {
    const { dealId } = request.params as { dealId: string }
    const body = request.body as {
      name: string
      type: 'lead' | 'co-lead' | 'follow-on' | 'strategic'
      checkSize?: string
      contactName?: string
      contactEmail?: string
      notes?: string
    }

    const entry: CoInvestor = {
      id: crypto.randomUUID(),
      dealId,
      name: body.name,
      type: body.type,
      checkSize: body.checkSize ?? null,
      contactName: body.contactName ?? null,
      contactEmail: body.contactEmail ?? null,
      notes: body.notes ?? null,
    }
    coInvestors.push(entry)
    return { data: entry }
  })

  app.delete('/api/v1/co-investors/:coInvestorId', async (request) => {
    const { coInvestorId } = request.params as { coInvestorId: string }
    const idx = coInvestors.findIndex((c) => c.id === coInvestorId)
    if (idx < 0) return { error: 'Not found', message: 'Co-investor not found', statusCode: 404 }

    coInvestors.splice(idx, 1)
    return { status: 'ok' }
  })

  // ── Deal Contacts ─────────────────────────────────────────────────

  app.get('/api/v1/deals/:dealId/contacts', async (request) => {
    const { dealId } = request.params as { dealId: string }
    return { data: dealContacts.filter((c) => c.dealId === dealId) }
  })

  app.post('/api/v1/deals/:dealId/contacts', async (request) => {
    const { dealId } = request.params as { dealId: string }
    const body = request.body as {
      name: string
      role: string
      email?: string
      phone?: string
      isPrimary?: boolean
    }

    const contact: DealContact = {
      id: crypto.randomUUID(),
      dealId,
      name: body.name,
      role: body.role,
      email: body.email ?? null,
      phone: body.phone ?? null,
      isPrimary: body.isPrimary ?? false,
    }
    dealContacts.push(contact)
    return { data: contact }
  })

  // ── TRL Integration ───────────────────────────────────────────────

  app.post('/api/v1/deals/:dealId/trl', async (request) => {
    const { dealId } = request.params as { dealId: string }
    const body = request.body as {
      trlScore: number
      trlDetails?: Record<string, unknown>
    }

    const idx = deals.findIndex((d) => d.id === dealId)
    if (idx < 0) return { error: 'Not found', message: 'Deal not found', statusCode: 404 }

    deals[idx] = {
      ...deals[idx],
      trlScore: body.trlScore,
      trlDetails: body.trlDetails ?? null,
      updatedAt: new Date().toISOString(),
    }
    return { data: deals[idx] }
  })

  // ── Pipeline Dashboard Stats ──────────────────────────────────────

  app.get('/api/v1/deals/dashboard/stats', async () => {
    const byStage: Record<string, number> = {}
    const bySector: Record<string, number> = {}
    let totalCheckSize = 0

    for (const deal of deals) {
      byStage[deal.stage] = (byStage[deal.stage] ?? 0) + 1
      bySector[deal.sector] = (bySector[deal.sector] ?? 0) + 1
      if (deal.checkSize) totalCheckSize += Number(deal.checkSize)
    }

    const avgTrl =
      deals.filter((d) => d.trlScore !== null).length > 0
        ? deals.filter((d) => d.trlScore !== null).reduce((sum, d) => sum + (d.trlScore ?? 0), 0) /
          deals.filter((d) => d.trlScore !== null).length
        : null

    return {
      data: {
        totalDeals: deals.length,
        byStage,
        bySector,
        totalCheckSize,
        averageTrl: avgTrl,
        activeDeals: deals.filter((d) => d.stage !== 'closed' && d.stage !== 'passed').length,
      },
    }
  })

  // ── LP Pipeline Tracking ──────────────────────────────────────────

  app.get('/api/v1/lp-pipeline', async (request) => {
    const { stage } = request.query as { stage?: string }
    let filtered = lpPipeline
    if (stage) filtered = filtered.filter((e) => e.stage === stage)
    return { data: filtered }
  })

  app.post('/api/v1/lp-pipeline', async (request) => {
    const body = request.body as {
      lpId: string
      lpName: string
      stage?: string
      commitmentTarget?: string
      notes?: string
    }

    const entry: LpPipelineEntry = {
      id: crypto.randomUUID(),
      lpId: body.lpId,
      lpName: body.lpName,
      stage: body.stage ?? 'prospecting',
      commitmentTarget: body.commitmentTarget ?? null,
      lastContactDate: null,
      nextFollowUp: null,
      notes: body.notes ?? null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    lpPipeline.push(entry)
    return { data: entry }
  })

  app.patch('/api/v1/lp-pipeline/:entryId', async (request) => {
    const { entryId } = request.params as { entryId: string }
    const body = request.body as Partial<
      Pick<LpPipelineEntry, 'stage' | 'commitmentTarget' | 'lastContactDate' | 'nextFollowUp' | 'notes'>
    >

    const idx = lpPipeline.findIndex((e) => e.id === entryId)
    if (idx < 0) return { error: 'Not found', message: 'LP pipeline entry not found', statusCode: 404 }

    lpPipeline[idx] = { ...lpPipeline[idx], ...body, updatedAt: new Date().toISOString() }
    return { data: lpPipeline[idx] }
  })

}
