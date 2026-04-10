import type { FastifyInstance } from 'fastify'
import type {
  LpAccount,
  LpAccountType,
  LpAccountStatus,
  CapitalCall,
  CapitalCallStatus,
  CapitalCallLineItem,
  Distribution,
  DistributionType,
  DistributionStatus,
  DistributionLineItem,
  FundSummary,
} from '@arca/shared'
import { FUND_CONFIG } from '@arca/shared'

// ── In-memory stores (until DB is connected) ────────────────────────

const lpAccounts: LpAccount[] = []
const capitalCalls: CapitalCall[] = []
const distributions: Distribution[] = []

let callCounter = 0
let distCounter = 0

// Fund config from shared constants (overridable via env)
const fundConfig = {
  fundName: process.env.FUND_NAME ?? FUND_CONFIG.name,
  vintage: Number(process.env.FUND_VINTAGE ?? new Date().getFullYear()),
  targetSize: Number(process.env.FUND_TARGET_SIZE ?? FUND_CONFIG.targetSize),
  currency: FUND_CONFIG.currency,
  managementFee: FUND_CONFIG.managementFee,
  carry: FUND_CONFIG.carry,
  hurdleRate: FUND_CONFIG.hurdleRate,
  fundLifeYears: FUND_CONFIG.fundLifeYears,
  extensionYears: FUND_CONFIG.extensionYears,
  investmentPeriodYears: FUND_CONFIG.investmentPeriodYears,
}

// ── Routes ──────────────────────────────────────────────────────────

export async function fundAdminRoutes(app: FastifyInstance) {
  // ── Fund Summary ────────────────────────────────────────────────

  app.get('/api/v1/fund/summary', async () => {
    const totalCommitments = lpAccounts.reduce((s, lp) => s + lp.commitmentAmount, 0)
    const totalCalled = lpAccounts.reduce((s, lp) => s + lp.calledAmount, 0)
    const totalDistributed = lpAccounts.reduce((s, lp) => s + lp.distributedAmount, 0)
    const nav = lpAccounts.reduce((s, lp) => s + lp.nav, 0)
    const pendingCapitalCalls = capitalCalls.filter(
      (c) => c.status === 'draft' || c.status === 'sent' || c.status === 'partially-paid',
    ).length

    const summary: FundSummary = {
      fundName: fundConfig.fundName,
      vintage: fundConfig.vintage,
      targetSize: fundConfig.targetSize,
      currency: fundConfig.currency,
      managementFee: fundConfig.managementFee,
      carry: fundConfig.carry,
      hurdleRate: fundConfig.hurdleRate,
      fundLifeYears: fundConfig.fundLifeYears,
      extensionYears: fundConfig.extensionYears,
      investmentPeriodYears: fundConfig.investmentPeriodYears,
      totalCommitments,
      totalCalled,
      totalDistributed,
      nav,
      lpCount: lpAccounts.filter((lp) => lp.status === 'active').length,
      pendingCapitalCalls,
    }
    return { data: summary }
  })

  // ── LP Account CRUD ─────────────────────────────────────────────

  app.get('/api/v1/fund/lp-accounts', async (request) => {
    const { status } = request.query as { status?: LpAccountStatus }
    let filtered = lpAccounts
    if (status) filtered = filtered.filter((lp) => lp.status === status)
    return { data: filtered }
  })

  app.get('/api/v1/fund/lp-accounts/:lpAccountId', async (request) => {
    const { lpAccountId } = request.params as { lpAccountId: string }
    const lp = lpAccounts.find((a) => a.id === lpAccountId)
    if (!lp) return { error: 'Not found', message: 'LP account not found', statusCode: 404 }
    return { data: lp }
  })

  app.post('/api/v1/fund/lp-accounts', async (request) => {
    const body = request.body as {
      name: string
      type: LpAccountType
      email: string
      commitmentAmount: number
    }

    const lp: LpAccount = {
      id: crypto.randomUUID(),
      name: body.name,
      type: body.type,
      email: body.email,
      commitmentAmount: body.commitmentAmount,
      calledAmount: 0,
      distributedAmount: 0,
      nav: 0,
      status: 'invited',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    lpAccounts.push(lp)
    return { data: lp }
  })

  app.patch('/api/v1/fund/lp-accounts/:lpAccountId', async (request) => {
    const { lpAccountId } = request.params as { lpAccountId: string }
    const body = request.body as Partial<Pick<LpAccount, 'name' | 'email' | 'commitmentAmount' | 'status'>>

    const idx = lpAccounts.findIndex((a) => a.id === lpAccountId)
    if (idx < 0) return { error: 'Not found', message: 'LP account not found', statusCode: 404 }

    lpAccounts[idx] = { ...lpAccounts[idx], ...body, updatedAt: new Date().toISOString() }
    return { data: lpAccounts[idx] }
  })

  // ── Capital Calls ───────────────────────────────────────────────

  app.get('/api/v1/fund/capital-calls', async (request) => {
    const { status } = request.query as { status?: CapitalCallStatus }
    let filtered = capitalCalls
    if (status) filtered = filtered.filter((c) => c.status === status)
    return { data: filtered }
  })

  app.get('/api/v1/fund/capital-calls/:callId', async (request) => {
    const { callId } = request.params as { callId: string }
    const call = capitalCalls.find((c) => c.id === callId)
    if (!call) return { error: 'Not found', message: 'Capital call not found', statusCode: 404 }
    return { data: call }
  })

  app.post('/api/v1/fund/capital-calls', async (request) => {
    const body = request.body as {
      totalAmount: number
      dueDate: string
      purpose: string
    }

    // Auto-generate pro-rata line items for all active LPs
    const activeLps = lpAccounts.filter((lp) => lp.status === 'active')
    const totalCommitments = activeLps.reduce((s, lp) => s + lp.commitmentAmount, 0)

    const lineItems: CapitalCallLineItem[] = activeLps.map((lp) => {
      const proRata = totalCommitments > 0 ? lp.commitmentAmount / totalCommitments : 0
      return {
        lpAccountId: lp.id,
        amount: Math.round(body.totalAmount * proRata * 100) / 100,
        proRataPercentage: Math.round(proRata * 10000) / 100,
        status: 'pending',
        paidAt: null,
      }
    })

    callCounter++
    const call: CapitalCall = {
      id: crypto.randomUUID(),
      callNumber: callCounter,
      totalAmount: body.totalAmount,
      dueDate: body.dueDate,
      purpose: body.purpose,
      status: 'draft',
      lineItems,
      createdAt: new Date().toISOString(),
    }
    capitalCalls.push(call)
    return { data: call }
  })

  app.post('/api/v1/fund/capital-calls/:callId/send', async (request) => {
    const { callId } = request.params as { callId: string }
    const idx = capitalCalls.findIndex((c) => c.id === callId)
    if (idx < 0) return { error: 'Not found', message: 'Capital call not found', statusCode: 404 }
    if (capitalCalls[idx].status !== 'draft') {
      return { error: 'Invalid', message: 'Only draft capital calls can be sent', statusCode: 400 }
    }

    capitalCalls[idx] = { ...capitalCalls[idx], status: 'sent' }
    return { data: capitalCalls[idx] }
  })

  app.post('/api/v1/fund/capital-calls/:callId/record-payment', async (request) => {
    const { callId } = request.params as { callId: string }
    const body = request.body as { lpAccountId: string }

    const callIdx = capitalCalls.findIndex((c) => c.id === callId)
    if (callIdx < 0) return { error: 'Not found', message: 'Capital call not found', statusCode: 404 }

    const call = capitalCalls[callIdx]
    const lineIdx = call.lineItems.findIndex((li) => li.lpAccountId === body.lpAccountId)
    if (lineIdx < 0) return { error: 'Not found', message: 'LP not found in this capital call', statusCode: 404 }

    call.lineItems[lineIdx] = {
      ...call.lineItems[lineIdx],
      status: 'paid',
      paidAt: new Date().toISOString(),
    }

    // Update LP account called amount
    const lpIdx = lpAccounts.findIndex((lp) => lp.id === body.lpAccountId)
    if (lpIdx >= 0) {
      lpAccounts[lpIdx] = {
        ...lpAccounts[lpIdx],
        calledAmount: lpAccounts[lpIdx].calledAmount + call.lineItems[lineIdx].amount,
        updatedAt: new Date().toISOString(),
      }
    }

    // Check if all line items are paid
    const allPaid = call.lineItems.every((li) => li.status === 'paid')
    const somePaid = call.lineItems.some((li) => li.status === 'paid')
    capitalCalls[callIdx] = {
      ...call,
      status: allPaid ? 'completed' : somePaid ? 'partially-paid' : call.status,
    }

    return { data: capitalCalls[callIdx] }
  })

  // ── Distributions ───────────────────────────────────────────────

  app.get('/api/v1/fund/distributions', async (request) => {
    const { status } = request.query as { status?: DistributionStatus }
    let filtered = distributions
    if (status) filtered = filtered.filter((d) => d.status === status)
    return { data: filtered }
  })

  app.post('/api/v1/fund/distributions', async (request) => {
    const body = request.body as {
      totalAmount: number
      distributionDate: string
      type: DistributionType
    }

    const activeLps = lpAccounts.filter((lp) => lp.status === 'active')
    const totalCommitments = activeLps.reduce((s, lp) => s + lp.commitmentAmount, 0)

    const lineItems: DistributionLineItem[] = activeLps.map((lp) => {
      const proRata = totalCommitments > 0 ? lp.commitmentAmount / totalCommitments : 0
      return {
        lpAccountId: lp.id,
        amount: Math.round(body.totalAmount * proRata * 100) / 100,
        proRataPercentage: Math.round(proRata * 10000) / 100,
      }
    })

    distCounter++
    const dist: Distribution = {
      id: crypto.randomUUID(),
      distributionNumber: distCounter,
      totalAmount: body.totalAmount,
      distributionDate: body.distributionDate,
      type: body.type,
      status: 'draft',
      lineItems,
      createdAt: new Date().toISOString(),
    }
    distributions.push(dist)
    return { data: dist }
  })

  app.post('/api/v1/fund/distributions/:distId/approve', async (request) => {
    const { distId } = request.params as { distId: string }
    const idx = distributions.findIndex((d) => d.id === distId)
    if (idx < 0) return { error: 'Not found', message: 'Distribution not found', statusCode: 404 }
    if (distributions[idx].status !== 'draft') {
      return { error: 'Invalid', message: 'Only draft distributions can be approved', statusCode: 400 }
    }

    distributions[idx] = { ...distributions[idx], status: 'approved' }
    return { data: distributions[idx] }
  })

  app.post('/api/v1/fund/distributions/:distId/distribute', async (request) => {
    const { distId } = request.params as { distId: string }
    const idx = distributions.findIndex((d) => d.id === distId)
    if (idx < 0) return { error: 'Not found', message: 'Distribution not found', statusCode: 404 }
    if (distributions[idx].status !== 'approved') {
      return { error: 'Invalid', message: 'Only approved distributions can be distributed', statusCode: 400 }
    }

    // Update LP accounts
    for (const li of distributions[idx].lineItems) {
      const lpIdx = lpAccounts.findIndex((lp) => lp.id === li.lpAccountId)
      if (lpIdx >= 0) {
        lpAccounts[lpIdx] = {
          ...lpAccounts[lpIdx],
          distributedAmount: lpAccounts[lpIdx].distributedAmount + li.amount,
          updatedAt: new Date().toISOString(),
        }
      }
    }

    distributions[idx] = { ...distributions[idx], status: 'distributed' }
    return { data: distributions[idx] }
  })
}
