/**
 * Steward AML/KYC integration service.
 *
 * Steward is an AI-driven compliance platform selected for cross-border
 * capability (Singapore GP + China-origin capital flows). This module
 * wraps Steward's REST API for identity verification, OFAC/PEP screening,
 * adverse media checks, and source-of-funds verification.
 *
 * Environment variables:
 *   STEWARD_API_KEY     - API key for authentication
 *   STEWARD_API_URL     - Base URL (default: https://api.steward.com/v1)
 *   STEWARD_WEBHOOK_URL - Webhook endpoint for async screening results
 */

import type { ScreeningType, ScreeningResult, RiskLevel } from '@arca/shared'

// ── Types ───────────────────────────────────────────────────────────

export interface StewardConfig {
  apiKey: string
  baseUrl: string
  webhookUrl?: string
}

export interface StewardSubjectPayload {
  externalId: string
  firstName: string
  lastName: string
  dateOfBirth?: string
  nationality?: string
  countryOfResidence?: string
  email?: string
  entityType: 'individual' | 'entity'
  entityName?: string
  entityRegistrationCountry?: string
}

export interface StewardScreeningRequest {
  subject: StewardSubjectPayload
  screeningTypes: ScreeningType[]
  callbackUrl?: string
}

export interface StewardScreeningResponse {
  id: string
  status: 'pending' | 'completed' | 'failed'
  results: StewardScreeningResult[]
  createdAt: string
}

export interface StewardScreeningResult {
  screeningType: ScreeningType
  result: ScreeningResult
  riskLevel: RiskLevel | null
  matches: StewardMatch[]
  completedAt: string | null
}

export interface StewardMatch {
  matchId: string
  matchScore: number
  source: string
  details: Record<string, unknown>
}

// ── Client ──────────────────────────────────────────────────────────

export function createStewardClient(config: StewardConfig) {
  const { apiKey, baseUrl, webhookUrl } = config

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
      throw new Error(`Steward API error ${res.status}: ${errorBody}`)
    }

    return res.json() as Promise<T>
  }

  return {
    /**
     * Submit a new screening request for an investor (LP).
     */
    async submitScreening(payload: StewardScreeningRequest): Promise<StewardScreeningResponse> {
      return request<StewardScreeningResponse>('POST', '/screenings', {
        ...payload,
        callbackUrl: payload.callbackUrl ?? webhookUrl,
      })
    },

    /**
     * Get the current status and results of a screening.
     */
    async getScreening(screeningId: string): Promise<StewardScreeningResponse> {
      return request<StewardScreeningResponse>('GET', `/screenings/${screeningId}`)
    },

    /**
     * Run ongoing monitoring re-screen for an existing subject.
     */
    async rescreen(subjectExternalId: string, screeningTypes: ScreeningType[]): Promise<StewardScreeningResponse> {
      return request<StewardScreeningResponse>('POST', `/subjects/${subjectExternalId}/rescreen`, {
        screeningTypes,
        callbackUrl: webhookUrl,
      })
    },

    /**
     * Upload a document for a subject (e.g., ID, source-of-funds declaration).
     */
    async uploadDocument(subjectExternalId: string, documentType: string, fileName: string, fileContent: Buffer): Promise<{ id: string; status: string }> {
      const formData = new FormData()
      formData.append('documentType', documentType)
      formData.append('file', new Blob([fileContent]), fileName)

      const res = await fetch(`${baseUrl}/subjects/${subjectExternalId}/documents`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
        },
        body: formData,
      })

      if (!res.ok) {
        const errorBody = await res.text()
        throw new Error(`Steward API error ${res.status}: ${errorBody}`)
      }

      return res.json() as Promise<{ id: string; status: string }>
    },

    /**
     * Get the risk assessment summary for a subject.
     */
    async getRiskAssessment(subjectExternalId: string): Promise<{
      overallRisk: RiskLevel
      factors: { factor: string; level: RiskLevel; notes: string }[]
    }> {
      return request('GET', `/subjects/${subjectExternalId}/risk-assessment`)
    },
  }
}

// ── Factory ─────────────────────────────────────────────────────────

let _client: ReturnType<typeof createStewardClient> | null = null

export function getStewardClient(): ReturnType<typeof createStewardClient> {
  if (!_client) {
    const apiKey = process.env.STEWARD_API_KEY
    if (!apiKey) {
      throw new Error('STEWARD_API_KEY environment variable is required')
    }
    _client = createStewardClient({
      apiKey,
      baseUrl: process.env.STEWARD_API_URL ?? 'https://api.steward.com/v1',
      webhookUrl: process.env.STEWARD_WEBHOOK_URL,
    })
  }
  return _client
}
