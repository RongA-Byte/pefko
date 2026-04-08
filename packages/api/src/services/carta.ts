/**
 * Carta Fund Management integration service.
 *
 * Carta is the industry-standard fund administration platform selected for
 * ARCA Fund I. This module wraps Carta's REST API for fund entity management,
 * LP portal operations, capital calls, distributions, and reporting.
 *
 * Environment variables:
 *   CARTA_API_KEY      - API key for authentication
 *   CARTA_API_URL      - Base URL (default: https://api.carta.com/v1)
 *   CARTA_FUND_ID      - Primary fund entity ID (set after fund setup)
 */

// ── Types ───────────────────────────────────────────────────────────

export interface CartaConfig {
  apiKey: string
  baseUrl: string
  fundId?: string
}

export interface CartaFund {
  id: string
  name: string
  legalName: string
  status: 'draft' | 'active' | 'closed'
  vintage: number
  targetSize: number
  currency: string
  gpEntityId: string
  createdAt: string
}

export interface CartaLpAccount {
  id: string
  fundId: string
  name: string
  type: 'individual' | 'entity' | 'trust'
  email: string
  commitmentAmount: number
  calledAmount: number
  distributedAmount: number
  nav: number
  status: 'invited' | 'onboarding' | 'active' | 'inactive'
  portalAccessEnabled: boolean
  createdAt: string
}

export interface CartaCapitalCall {
  id: string
  fundId: string
  callNumber: number
  totalAmount: number
  dueDate: string
  purpose: string
  status: 'draft' | 'sent' | 'partially-paid' | 'completed' | 'overdue'
  lineItems: CartaCapitalCallLineItem[]
  createdAt: string
}

export interface CartaCapitalCallLineItem {
  lpAccountId: string
  amount: number
  proRataPercentage: number
  status: 'pending' | 'paid' | 'overdue'
  paidAt: string | null
}

export interface CartaDistribution {
  id: string
  fundId: string
  distributionNumber: number
  totalAmount: number
  distributionDate: string
  type: 'return-of-capital' | 'profit' | 'recallable'
  status: 'draft' | 'approved' | 'distributed'
  lineItems: CartaDistributionLineItem[]
  createdAt: string
}

export interface CartaDistributionLineItem {
  lpAccountId: string
  amount: number
  proRataPercentage: number
}

export interface CartaFundReport {
  id: string
  fundId: string
  reportingPeriod: string
  type: 'quarterly' | 'annual' | 'capital-call' | 'distribution'
  status: 'draft' | 'published'
  metrics: {
    nav: number
    tvpi: number
    dpi: number
    rvpi: number
    irr: number | null
    totalCommitments: number
    totalCalled: number
    totalDistributed: number
  }
  publishedAt: string | null
  createdAt: string
}

// ── Client ──────────────────────────────────────────────────────────

export function createCartaClient(config: CartaConfig) {
  const { apiKey, baseUrl, fundId } = config

  async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
    const res = await fetch(`${baseUrl}${path}`, {
      method,
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
    })

    if (!res.ok) {
      const errorBody = await res.text()
      throw new Error(`Carta API error ${res.status}: ${errorBody}`)
    }

    return res.json() as Promise<T>
  }

  function requireFundId(): string {
    if (!fundId) throw new Error('CARTA_FUND_ID is required for this operation')
    return fundId
  }

  return {
    // ── Fund Operations ───────────────────────────────────────────

    async getFund(): Promise<CartaFund> {
      return request<CartaFund>('GET', `/funds/${requireFundId()}`)
    },

    async listFunds(): Promise<CartaFund[]> {
      return request<CartaFund[]>('GET', '/funds')
    },

    // ── LP Account Operations ─────────────────────────────────────

    async createLpAccount(payload: {
      name: string
      type: 'individual' | 'entity' | 'trust'
      email: string
      commitmentAmount: number
    }): Promise<CartaLpAccount> {
      return request<CartaLpAccount>('POST', `/funds/${requireFundId()}/lp-accounts`, payload)
    },

    async getLpAccount(lpAccountId: string): Promise<CartaLpAccount> {
      return request<CartaLpAccount>('GET', `/funds/${requireFundId()}/lp-accounts/${lpAccountId}`)
    },

    async listLpAccounts(): Promise<CartaLpAccount[]> {
      return request<CartaLpAccount[]>('GET', `/funds/${requireFundId()}/lp-accounts`)
    },

    async inviteLpToPortal(lpAccountId: string): Promise<{ status: string }> {
      return request('POST', `/funds/${requireFundId()}/lp-accounts/${lpAccountId}/invite`)
    },

    // ── Capital Calls ─────────────────────────────────────────────

    async createCapitalCall(payload: {
      totalAmount: number
      dueDate: string
      purpose: string
    }): Promise<CartaCapitalCall> {
      return request<CartaCapitalCall>('POST', `/funds/${requireFundId()}/capital-calls`, payload)
    },

    async getCapitalCall(callId: string): Promise<CartaCapitalCall> {
      return request<CartaCapitalCall>('GET', `/funds/${requireFundId()}/capital-calls/${callId}`)
    },

    async listCapitalCalls(): Promise<CartaCapitalCall[]> {
      return request<CartaCapitalCall[]>('GET', `/funds/${requireFundId()}/capital-calls`)
    },

    async sendCapitalCall(callId: string): Promise<CartaCapitalCall> {
      return request<CartaCapitalCall>('POST', `/funds/${requireFundId()}/capital-calls/${callId}/send`)
    },

    // ── Distributions ─────────────────────────────────────────────

    async createDistribution(payload: {
      totalAmount: number
      distributionDate: string
      type: 'return-of-capital' | 'profit' | 'recallable'
    }): Promise<CartaDistribution> {
      return request<CartaDistribution>('POST', `/funds/${requireFundId()}/distributions`, payload)
    },

    async listDistributions(): Promise<CartaDistribution[]> {
      return request<CartaDistribution[]>('GET', `/funds/${requireFundId()}/distributions`)
    },

    // ── Reporting ─────────────────────────────────────────────────

    async createReport(payload: {
      reportingPeriod: string
      type: 'quarterly' | 'annual' | 'capital-call' | 'distribution'
    }): Promise<CartaFundReport> {
      return request<CartaFundReport>('POST', `/funds/${requireFundId()}/reports`, payload)
    },

    async listReports(): Promise<CartaFundReport[]> {
      return request<CartaFundReport[]>('GET', `/funds/${requireFundId()}/reports`)
    },

    async publishReport(reportId: string): Promise<CartaFundReport> {
      return request<CartaFundReport>('POST', `/funds/${requireFundId()}/reports/${reportId}/publish`)
    },
  }
}

// ── Factory ─────────────────────────────────────────────────────────

let _client: ReturnType<typeof createCartaClient> | null = null

export function getCartaClient(): ReturnType<typeof createCartaClient> {
  if (!_client) {
    const apiKey = process.env.CARTA_API_KEY
    if (!apiKey) {
      throw new Error('CARTA_API_KEY environment variable is required')
    }
    _client = createCartaClient({
      apiKey,
      baseUrl: process.env.CARTA_API_URL ?? 'https://api.carta.com/v1',
      fundId: process.env.CARTA_FUND_ID,
    })
  }
  return _client
}
