import type { FastifyInstance } from 'fastify'
import type { TrlRubric, TrlAssessment, Sector } from '@arca/shared'
import { TRL_LABELS } from '@arca/shared'

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
