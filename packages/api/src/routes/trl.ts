import type { FastifyInstance } from 'fastify'
import type { TrlRubric, TrlAssessment, Sector } from '@arca/shared'
import { TRL_LABELS, SECTOR_TRL_ENTRY } from '@arca/shared'

// In-memory store until DB is connected
const rubrics: TrlRubric[] = []
const assessments: TrlAssessment[] = []

export async function trlRoutes(app: FastifyInstance) {
  // ── Rubrics ─────────────────────────────────────────────────────────

  app.get('/api/v1/trl/rubrics', async (request) => {
    const { sector } = request.query as { sector?: Sector }
    const filtered = sector ? rubrics.filter((r) => r.sector === sector) : rubrics
    return { data: filtered }
  })

  app.get('/api/v1/trl/rubrics/:sector/:level', async (request) => {
    const { sector, level } = request.params as { sector: Sector; level: string }
    const rubric = rubrics.find((r) => r.sector === sector && r.level === Number(level))
    if (!rubric) {
      return {
        data: {
          sector,
          level: Number(level),
          label: TRL_LABELS[Number(level)] ?? `TRL ${level}`,
          description: '',
          criteria: [],
        },
      }
    }
    return { data: rubric }
  })

  app.post('/api/v1/trl/rubrics', async (request) => {
    const body = request.body as TrlRubric
    const existing = rubrics.findIndex(
      (r) => r.sector === body.sector && r.level === body.level,
    )
    if (existing >= 0) {
      rubrics[existing] = body
    } else {
      rubrics.push(body)
    }
    return { data: body }
  })

  // ── TRL Labels (reference data) ────────────────────────────────────

  app.get('/api/v1/trl/labels', async () => {
    return { data: TRL_LABELS }
  })

  // ── Sector-specific TRL entry criteria ────────────────────────────

  app.get('/api/v1/trl/entry-criteria', async () => {
    return { data: SECTOR_TRL_ENTRY }
  })

  app.get('/api/v1/trl/entry-criteria/:sector', async (request) => {
    const { sector } = request.params as { sector: Sector }
    const criteria = SECTOR_TRL_ENTRY[sector]
    if (!criteria) return { error: 'Not found', message: 'Unknown sector', statusCode: 404 }
    return { data: { sector, ...criteria, description: `Entry TRL range for ${sector}: TRL ${criteria.min}-${criteria.max}` } }
  })

  app.post('/api/v1/trl/validate-entry', async (request) => {
    const body = request.body as { sector: Sector; trlLevel: number }
    const criteria = SECTOR_TRL_ENTRY[body.sector]
    if (!criteria) return { error: 'Not found', message: 'Unknown sector', statusCode: 404 }

    const meetsEntry = body.trlLevel >= criteria.min && body.trlLevel <= criteria.max
    return {
      data: {
        sector: body.sector,
        trlLevel: body.trlLevel,
        requiredRange: criteria,
        meetsEntryCriteria: meetsEntry,
        message: meetsEntry
          ? `TRL ${body.trlLevel} meets ${body.sector} entry criteria (TRL ${criteria.min}-${criteria.max})`
          : `TRL ${body.trlLevel} does not meet ${body.sector} entry criteria (requires TRL ${criteria.min}-${criteria.max})`,
      },
    }
  })

  // ── Assessments ────────────────────────────────────────────────────

  app.get('/api/v1/trl/assessments', async (request) => {
    const { dealId } = request.query as { dealId?: string }
    const filtered = dealId ? assessments.filter((a) => a.dealId === dealId) : assessments
    return { data: filtered }
  })

  app.post('/api/v1/trl/assessments', async (request) => {
    const body = request.body as Omit<TrlAssessment, 'id'>
    const assessment: TrlAssessment = {
      ...body,
      id: crypto.randomUUID(),
    }
    assessments.push(assessment)
    return { data: assessment }
  })

  app.get('/api/v1/trl/assessments/:id', async (request) => {
    const { id } = request.params as { id: string }
    const assessment = assessments.find((a) => a.id === id)
    if (!assessment) {
      return { error: 'Not found', message: 'Assessment not found', statusCode: 404 }
    }
    return { data: assessment }
  })
}
