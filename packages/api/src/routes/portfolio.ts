import type { FastifyInstance } from 'fastify'
import type {
  Sector,
  PortfolioCompany,
  PortfolioKpi,
  PortfolioMetrics,
  PortfolioSectorBreakdown,
  PortfolioStatus,
} from '@arca/shared'
import { SECTORS, SECTOR_ALLOCATION_TARGETS, GEO_CONCENTRATION_ALERT_THRESHOLD, INVESTMENT_PARAMS, FUND_CONFIG } from '@arca/shared'

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

  // Tiered carry deduction based on gross MOIC
  const grossProfit = nav - totalInvested
  let carryDeduction = 0
  if (grossProfit > 0 && totalInvested > 0) {
    const tiers = FUND_CONFIG.carry.tiers
    let remainingProfit = grossProfit
    for (let i = 0; i < tiers.length; i++) {
      const tierCap = tiers[i].moicThreshold * totalInvested - totalInvested
      const prevCap = i > 0 ? tiers[i - 1].moicThreshold * totalInvested - totalInvested : 0
      const tierProfit = Math.min(remainingProfit, Math.max(0, tierCap - prevCap))
      carryDeduction += tierProfit * tiers[i].rate
      remainingProfit -= tierProfit
      if (remainingProfit <= 0) break
    }
  }
  const tvpiNet = totalInvested > 0 ? (nav - carryDeduction) / totalInvested : 0

  return {
    tvpiGross,
    tvpiNet,
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
      location?: string
      investmentDate: string
      investmentAmount: string
      ownershipPct?: number
      currentValuation?: string
      trlScore?: number
      trlDetails?: Record<string, unknown>
      coInvestors?: string[]
      dealId?: string
    }

    // Validate check-size limits
    const amount = Number(body.investmentAmount)
    if (amount < INVESTMENT_PARAMS.firstCheckRange.min || amount > INVESTMENT_PARAMS.firstCheckRange.max) {
      return {
        error: 'Validation',
        message: `Investment amount must be between $${(INVESTMENT_PARAMS.firstCheckRange.min / 1e6).toFixed(1)}M and $${(INVESTMENT_PARAMS.firstCheckRange.max / 1e6).toFixed(1)}M.`,
        statusCode: 400,
      }
    }

    // Validate target ownership range
    if (body.ownershipPct != null) {
      if (body.ownershipPct < INVESTMENT_PARAMS.targetOwnership.min || body.ownershipPct > INVESTMENT_PARAMS.targetOwnership.max) {
        return {
          error: 'Validation',
          message: `Target ownership must be between ${INVESTMENT_PARAMS.targetOwnership.min * 100}% and ${INVESTMENT_PARAMS.targetOwnership.max * 100}%.`,
          statusCode: 400,
        }
      }
    }

    const company: PortfolioCompany = {
      id: crypto.randomUUID(),
      dealId: body.dealId ?? null,
      name: body.name,
      sector: body.sector,
      location: body.location ?? null,
      investmentDate: body.investmentDate,
      investmentAmount: body.investmentAmount,
      followOnAmount: 0,
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

  // ── Sector Allocation vs Targets ────────────────────────────────

  app.get('/api/v1/portfolio/allocation-status', async () => {
    const totalInvested = companies.reduce((s, c) => s + Number(c.investmentAmount) + c.followOnAmount, 0)
    const allocations: Record<string, { invested: number; pct: number; target: { min: number; max: number }; withinTarget: boolean; alert: string | null }> = {}

    for (const [sector, target] of Object.entries(SECTOR_ALLOCATION_TARGETS)) {
      const sectorInvested = companies
        .filter((c) => c.sector === sector)
        .reduce((s, c) => s + Number(c.investmentAmount) + c.followOnAmount, 0)
      const pct = totalInvested > 0 ? sectorInvested / totalInvested : 0
      const withinTarget = totalInvested === 0 || (pct >= target.min && pct <= target.max)
      let alert: string | null = null
      if (totalInvested > 0 && pct > target.max) alert = `Over-allocated: ${(pct * 100).toFixed(1)}% vs ${(target.max * 100).toFixed(0)}% max`
      if (totalInvested > 0 && pct < target.min && companies.some((c) => c.sector === sector)) alert = `Under-allocated: ${(pct * 100).toFixed(1)}% vs ${(target.min * 100).toFixed(0)}% min`

      allocations[sector] = { invested: sectorInvested, pct: Math.round(pct * 10000) / 100, target, withinTarget, alert }
    }

    return { data: { totalInvested, allocations } }
  })

  // ── Geographic Concentration ───────────────────────────────────

  app.get('/api/v1/portfolio/geographic-concentration', async () => {
    const byLocation: Record<string, { count: number; invested: number }> = {}
    const totalInvested = companies.reduce((s, c) => s + Number(c.investmentAmount) + c.followOnAmount, 0)

    for (const c of companies) {
      const loc = c.location ?? 'Unknown'
      if (!byLocation[loc]) byLocation[loc] = { count: 0, invested: 0 }
      byLocation[loc].count++
      byLocation[loc].invested += Number(c.investmentAmount) + c.followOnAmount
    }

    const alerts: string[] = []
    const concentrations: Record<string, { count: number; invested: number; pct: number }> = {}
    for (const [loc, data] of Object.entries(byLocation)) {
      const pct = totalInvested > 0 ? data.invested / totalInvested : 0
      concentrations[loc] = { ...data, pct: Math.round(pct * 10000) / 100 }
      if (pct > GEO_CONCENTRATION_ALERT_THRESHOLD) {
        alerts.push(`${loc}: ${(pct * 100).toFixed(1)}% exceeds ${(GEO_CONCENTRATION_ALERT_THRESHOLD * 100).toFixed(0)}% threshold`)
      }
    }

    return { data: { concentrations, alerts, threshold: GEO_CONCENTRATION_ALERT_THRESHOLD } }
  })

  // ── Follow-on Investment ───────────────────────────────────────

  app.post('/api/v1/portfolio/companies/:companyId/follow-on', async (request) => {
    const { companyId } = request.params as { companyId: string }
    const body = request.body as { amount: number }

    const idx = companies.findIndex((c) => c.id === companyId)
    if (idx < 0) return { error: 'Not found', message: 'Portfolio company not found', statusCode: 404 }

    const company = companies[idx]
    const newTotal = company.followOnAmount + body.amount
    if (newTotal > INVESTMENT_PARAMS.maxFollowOnPerCompany) {
      return {
        error: 'Validation',
        message: `Follow-on would exceed $${(INVESTMENT_PARAMS.maxFollowOnPerCompany / 1e6).toFixed(0)}M cumulative limit. Current: $${(company.followOnAmount / 1e6).toFixed(2)}M, requested: $${(body.amount / 1e6).toFixed(2)}M.`,
        statusCode: 400,
      }
    }

    companies[idx] = { ...company, followOnAmount: newTotal, updatedAt: new Date().toISOString() }
    return { data: companies[idx] }
  })

  // ── Dashboard Stats ──────────────────────────────────────────────

  app.get('/api/v1/portfolio/dashboard', async () => {
    const metrics = calcFundMetrics()
    const breakdown = calcSectorBreakdown()
    const activeCount = companies.filter((c) => c.status === 'active').length
    const exitedCount = companies.filter((c) => c.status === 'exited').length

    // Sector allocation alerts
    const totalInvested = companies.reduce((s, c) => s + Number(c.investmentAmount) + c.followOnAmount, 0)
    const sectorAlerts: string[] = []
    for (const [sector, target] of Object.entries(SECTOR_ALLOCATION_TARGETS)) {
      const sectorInvested = companies.filter((c) => c.sector === sector).reduce((s, c) => s + Number(c.investmentAmount) + c.followOnAmount, 0)
      const pct = totalInvested > 0 ? sectorInvested / totalInvested : 0
      if (totalInvested > 0 && pct > target.max) sectorAlerts.push(`${sector}: ${(pct * 100).toFixed(1)}% > ${(target.max * 100).toFixed(0)}% target max`)
    }

    // Geographic alerts
    const geoAlerts: string[] = []
    const byLocation: Record<string, number> = {}
    for (const c of companies) {
      const loc = c.location ?? 'Unknown'
      byLocation[loc] = (byLocation[loc] ?? 0) + Number(c.investmentAmount) + c.followOnAmount
    }
    for (const [loc, invested] of Object.entries(byLocation)) {
      const pct = totalInvested > 0 ? invested / totalInvested : 0
      if (pct > GEO_CONCENTRATION_ALERT_THRESHOLD) geoAlerts.push(`${loc}: ${(pct * 100).toFixed(1)}% > ${(GEO_CONCENTRATION_ALERT_THRESHOLD * 100).toFixed(0)}% threshold`)
    }

    return {
      data: {
        metrics,
        sectorBreakdown: breakdown,
        activeCompanies: activeCount,
        exitedCompanies: exitedCount,
        totalCompanies: companies.length,
        alerts: { sector: sectorAlerts, geographic: geoAlerts },
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
