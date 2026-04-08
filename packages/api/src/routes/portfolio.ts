import type { FastifyInstance } from 'fastify'
import type {
  Sector,
  PortfolioCompany,
  PortfolioKpi,
  PortfolioMetrics,
  PortfolioSectorBreakdown,
  PortfolioStatus,
} from '@arca/shared'
import { SECTORS } from '@arca/shared'

// ── In-memory stores (until DB is connected) ────────────────────────

const companies: PortfolioCompany[] = []
const kpis: PortfolioKpi[] = []

// ── Metric Calculations ─────────────────────────────────────────────

function calcFundMetrics(): PortfolioMetrics {
  const active = companies.filter((c) => c.status !== 'written-off')
  const totalInvested = companies.reduce((s, c) => s + Number(c.investmentAmount), 0)
  const totalDistributed = companies
    .filter((c) => c.status === 'exited')
    .reduce((s, c) => s + Number(c.currentValuation ?? 0), 0)
  const unrealizedValue = active
    .filter((c) => c.status === 'active')
    .reduce((s, c) => s + Number(c.currentValuation ?? c.investmentAmount), 0)
  const nav = unrealizedValue + totalDistributed
  const tvpiGross = totalInvested > 0 ? nav / totalInvested : 0
  const dpi = totalInvested > 0 ? totalDistributed / totalInvested : 0
  const rvpi = totalInvested > 0 ? unrealizedValue / totalInvested : 0

  return {
    tvpiGross,
    tvpiNet: tvpiGross * 0.8, // simplified: 20% carry/fees
    dpi,
    rvpi,
    irr: null, // requires time-series cash flows
    nav,
    totalInvested,
    totalDistributed,
    unrealizedValue,
  }
}

function calcSectorBreakdown(): PortfolioSectorBreakdown[] {
  return SECTORS.map((sector) => {
    const sectorCos = companies.filter((c) => c.sector === sector)
    const totalInvested = sectorCos.reduce((s, c) => s + Number(c.investmentAmount), 0)
    const currentValue = sectorCos.reduce(
      (s, c) => s + Number(c.currentValuation ?? c.investmentAmount),
      0,
    )
    const withTrl = sectorCos.filter((c) => c.trlScore !== null)
    const avgTrl =
      withTrl.length > 0
        ? withTrl.reduce((s, c) => s + (c.trlScore ?? 0), 0) / withTrl.length
        : null

    return { sector, companyCount: sectorCos.length, totalInvested, currentValue, avgTrl }
  })
}

// ── Routes ──────────────────────────────────────────────────────────

export async function portfolioRoutes(app: FastifyInstance) {
  // ── Fund-level metrics ───────────────────────────────────────────

  app.get('/api/v1/portfolio/metrics', async () => {
    return { data: calcFundMetrics() }
  })

  app.get('/api/v1/portfolio/sector-breakdown', async () => {
    return { data: calcSectorBreakdown() }
  })

  // ── Portfolio Company CRUD ───────────────────────────────────────

  app.get('/api/v1/portfolio/companies', async (request) => {
    const { sector, status, search } = request.query as {
      sector?: Sector
      status?: PortfolioStatus
      search?: string
    }

    let filtered = companies
    if (sector) filtered = filtered.filter((c) => c.sector === sector)
    if (status) filtered = filtered.filter((c) => c.status === status)
    if (search) {
      const q = search.toLowerCase()
      filtered = filtered.filter((c) => c.name.toLowerCase().includes(q))
    }

    return { data: filtered }
  })

  app.get('/api/v1/portfolio/companies/:companyId', async (request) => {
    const { companyId } = request.params as { companyId: string }
    const company = companies.find((c) => c.id === companyId)
    if (!company) return { error: 'Not found', message: 'Portfolio company not found', statusCode: 404 }

    const companyKpis = kpis.filter((k) => k.companyId === companyId)
    return { data: { ...company, kpis: companyKpis } }
  })

  app.post('/api/v1/portfolio/companies', async (request) => {
    const body = request.body as {
      name: string
      sector: Sector
      investmentDate: string
      investmentAmount: string
      ownershipPct?: number
      currentValuation?: string
      trlScore?: number
      trlDetails?: Record<string, unknown>
      coInvestors?: string[]
      dealId?: string
    }

    const company: PortfolioCompany = {
      id: crypto.randomUUID(),
      dealId: body.dealId ?? null,
      name: body.name,
      sector: body.sector,
      investmentDate: body.investmentDate,
      investmentAmount: body.investmentAmount,
      ownershipPct: body.ownershipPct ?? null,
      currentValuation: body.currentValuation ?? null,
      trlScore: body.trlScore ?? null,
      trlDetails: body.trlDetails ?? null,
      status: 'active',
      coInvestors: body.coInvestors ?? [],
      kpis: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    companies.push(company)
    return { data: company }
  })

  app.patch('/api/v1/portfolio/companies/:companyId', async (request) => {
    const { companyId } = request.params as { companyId: string }
    const body = request.body as Partial<
      Pick<
        PortfolioCompany,
        | 'name'
        | 'sector'
        | 'ownershipPct'
        | 'currentValuation'
        | 'trlScore'
        | 'trlDetails'
        | 'status'
        | 'coInvestors'
      >
    >

    const idx = companies.findIndex((c) => c.id === companyId)
    if (idx < 0) return { error: 'Not found', message: 'Portfolio company not found', statusCode: 404 }

    companies[idx] = { ...companies[idx], ...body, updatedAt: new Date().toISOString() }
    return { data: companies[idx] }
  })

  // ── TRL Progression ──────────────────────────────────────────────

  app.get('/api/v1/portfolio/trl-progression', async () => {
    const progression = companies
      .filter((c) => c.trlScore !== null && c.status === 'active')
      .map((c) => ({
        companyId: c.id,
        companyName: c.name,
        sector: c.sector,
        currentTrl: c.trlScore,
        investmentDate: c.investmentDate,
      }))

    return { data: progression }
  })

  // ── KPI Collection ───────────────────────────────────────────────

  app.get('/api/v1/portfolio/companies/:companyId/kpis', async (request) => {
    const { companyId } = request.params as { companyId: string }
    return { data: kpis.filter((k) => k.companyId === companyId) }
  })

  app.post('/api/v1/portfolio/companies/:companyId/kpis', async (request) => {
    const { companyId } = request.params as { companyId: string }
    const body = request.body as {
      period: string
      revenue?: string
      burnRate?: string
      headcount?: number
      customMetrics?: Record<string, unknown>
    }

    const kpi: PortfolioKpi = {
      id: crypto.randomUUID(),
      companyId,
      period: body.period,
      revenue: body.revenue ?? null,
      burnRate: body.burnRate ?? null,
      headcount: body.headcount ?? null,
      customMetrics: body.customMetrics ?? {},
      submittedAt: new Date().toISOString(),
    }
    kpis.push(kpi)
    return { data: kpi }
  })

  // ── Dashboard Stats ──────────────────────────────────────────────

  app.get('/api/v1/portfolio/dashboard', async () => {
    const metrics = calcFundMetrics()
    const breakdown = calcSectorBreakdown()
    const activeCount = companies.filter((c) => c.status === 'active').length
    const exitedCount = companies.filter((c) => c.status === 'exited').length

    return {
      data: {
        metrics,
        sectorBreakdown: breakdown,
        activeCompanies: activeCount,
        exitedCompanies: exitedCount,
        totalCompanies: companies.length,
        recentActivity: companies
          .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
          .slice(0, 5)
          .map((c) => ({
            companyId: c.id,
            companyName: c.name,
            sector: c.sector,
            trlScore: c.trlScore,
            status: c.status,
            currentValuation: c.currentValuation,
          })),
      },
    }
  })
}
