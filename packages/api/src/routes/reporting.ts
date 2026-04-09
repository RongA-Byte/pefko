import type { FastifyInstance } from 'fastify'
import type {
  QuarterlyReport,
  ReportType,
  ReportStatus,
  PortfolioMetrics,
  PortfolioSectorBreakdown,
  PortfolioUpdate,
} from '@arca/shared'

// ── In-memory store (until DB is connected) ─────────────────────────

const reports: QuarterlyReport[] = []

// ── Routes ──────────────────────────────────────────────────────────

export async function reportingRoutes(app: FastifyInstance) {
  // ── List reports ─────────────────────────────────────────────────

  app.get('/api/v1/reports', async (request) => {
    const { type, status } = request.query as {
      type?: ReportType
      status?: ReportStatus
    }

    let filtered = reports
    if (type) filtered = filtered.filter((r) => r.type === type)
    if (status) filtered = filtered.filter((r) => r.status === status)

    return { data: filtered.sort((a, b) => b.period.localeCompare(a.period)) }
  })

  // ── Get single report ────────────────────────────────────────────

  app.get('/api/v1/reports/:reportId', async (request) => {
    const { reportId } = request.params as { reportId: string }
    const report = reports.find((r) => r.id === reportId)
    if (!report) return { error: 'Not found', message: 'Report not found', statusCode: 404 }
    return { data: report }
  })

  // ── Create report ────────────────────────────────────────────────

  app.post('/api/v1/reports', async (request) => {
    const body = request.body as {
      period: string
      type: ReportType
      marketCommentary?: string
      portfolioUpdates?: PortfolioUpdate[]
    }

    // Default empty metrics (will be populated from fund admin/portfolio data when available)
    const defaultMetrics: PortfolioMetrics = {
      tvpiGross: 0,
      tvpiNet: 0,
      dpi: 0,
      rvpi: 0,
      irr: null,
      nav: 0,
      totalInvested: 0,
      totalDistributed: 0,
      unrealizedValue: 0,
    }

    const report: QuarterlyReport = {
      id: crypto.randomUUID(),
      period: body.period,
      type: body.type,
      status: 'draft',
      fundMetrics: defaultMetrics,
      sectorBreakdown: [],
      portfolioUpdates: body.portfolioUpdates ?? [],
      marketCommentary: body.marketCommentary ?? null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      publishedAt: null,
    }
    reports.push(report)
    return { data: report }
  })

  // ── Update report ────────────────────────────────────────────────

  app.patch('/api/v1/reports/:reportId', async (request) => {
    const { reportId } = request.params as { reportId: string }
    const body = request.body as Partial<
      Pick<
        QuarterlyReport,
        | 'fundMetrics'
        | 'sectorBreakdown'
        | 'portfolioUpdates'
        | 'marketCommentary'
        | 'status'
      >
    >

    const idx = reports.findIndex((r) => r.id === reportId)
    if (idx < 0) return { error: 'Not found', message: 'Report not found', statusCode: 404 }

    reports[idx] = { ...reports[idx], ...body, updatedAt: new Date().toISOString() }
    return { data: reports[idx] }
  })

  // ── Publish report ───────────────────────────────────────────────

  app.post('/api/v1/reports/:reportId/publish', async (request) => {
    const { reportId } = request.params as { reportId: string }

    const idx = reports.findIndex((r) => r.id === reportId)
    if (idx < 0) return { error: 'Not found', message: 'Report not found', statusCode: 404 }

    if (reports[idx].status === 'published') {
      return { error: 'Conflict', message: 'Report is already published', statusCode: 409 }
    }

    reports[idx] = {
      ...reports[idx],
      status: 'published',
      publishedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    return { data: reports[idx] }
  })

  // ── Add portfolio update to report ───────────────────────────────

  app.post('/api/v1/reports/:reportId/portfolio-updates', async (request) => {
    const { reportId } = request.params as { reportId: string }
    const body = request.body as PortfolioUpdate

    const idx = reports.findIndex((r) => r.id === reportId)
    if (idx < 0) return { error: 'Not found', message: 'Report not found', statusCode: 404 }

    if (reports[idx].status === 'published') {
      return { error: 'Conflict', message: 'Cannot modify published report', statusCode: 409 }
    }

    reports[idx].portfolioUpdates.push(body)
    reports[idx].updatedAt = new Date().toISOString()
    return { data: reports[idx] }
  })

  // ── Report templates ─────────────────────────────────────────────

  app.get('/api/v1/reports/templates/quarterly', async () => {
    return {
      data: {
        sections: [
          {
            key: 'fund-overview',
            title: 'Fund Overview',
            description: 'NAV, TVPI, DPI, RVPI, IRR summary',
            required: true,
          },
          {
            key: 'capital-activity',
            title: 'Capital Activity',
            description: 'Capital calls and distributions during the period',
            required: true,
          },
          {
            key: 'portfolio-summary',
            title: 'Portfolio Summary',
            description: 'Overview of all portfolio companies and their status',
            required: true,
          },
          {
            key: 'trl-progression',
            title: 'TRL Progression Report',
            description: 'Technology readiness advancement per portfolio company (ARCA custom supplement)',
            required: false,
          },
          {
            key: 'sector-intelligence',
            title: 'Sector Market Intelligence',
            description: 'Market analysis for AI, Space/Aero, and Bio/Medical sectors (ARCA custom supplement)',
            required: false,
          },
          {
            key: 'co-investment',
            title: 'Co-Investment Opportunities',
            description: 'Available co-investment opportunities for LPs (ARCA custom supplement)',
            required: false,
          },
          {
            key: 'market-commentary',
            title: 'Market Commentary',
            description: 'GP perspective on market conditions and outlook',
            required: false,
          },
        ],
      },
    }
  })

  // ── Dashboard summary ────────────────────────────────────────────

  app.get('/api/v1/reports/dashboard', async () => {
    const published = reports.filter((r) => r.status === 'published')
    const drafts = reports.filter((r) => r.status === 'draft')
    const latest = published.sort((a, b) => b.period.localeCompare(a.period))[0] ?? null

    return {
      data: {
        totalReports: reports.length,
        publishedCount: published.length,
        draftCount: drafts.length,
        latestReport: latest
          ? {
              id: latest.id,
              period: latest.period,
              type: latest.type,
              publishedAt: latest.publishedAt,
            }
          : null,
      },
    }
  })
}
