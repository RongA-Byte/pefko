import type { FastifyInstance } from 'fastify'
import type { IcMemo, IcVoteRecord, MemoType, IcVote } from '@arca/shared'
import { IC_RULES } from '@arca/shared'

// In-memory store until DB is connected
const memos: IcMemo[] = []
const votes: IcVoteRecord[] = []

export async function memoRoutes(app: FastifyInstance) {
  // ── Memos ──────────────────────────────────────────────────────────

  app.get('/api/v1/memos', async (request) => {
    const { dealId, type } = request.query as { dealId?: string; type?: MemoType }
    let filtered = memos
    if (dealId) filtered = filtered.filter((m) => m.dealId === dealId)
    if (type) filtered = filtered.filter((m) => m.type === type)
    return { data: filtered }
  })

  app.get('/api/v1/memos/:id', async (request) => {
    const { id } = request.params as { id: string }
    const memo = memos.find((m) => m.id === id)
    if (!memo) {
      return { error: 'Not found', message: 'Memo not found', statusCode: 404 }
    }
    const memoVotes = votes.filter((v) => v.memoId === id)
    return { data: { ...memo, votes: memoVotes } }
  })

  app.post('/api/v1/memos', async (request) => {
    const body = request.body as Omit<IcMemo, 'id' | 'version'>
    const memo: IcMemo = {
      ...body,
      id: crypto.randomUUID(),
      version: 1,
    }
    memos.push(memo)
    return { data: memo }
  })

  app.patch('/api/v1/memos/:id', async (request) => {
    const { id } = request.params as { id: string }
    const updates = request.body as Partial<IcMemo>
    const idx = memos.findIndex((m) => m.id === id)
    if (idx < 0) {
      return { error: 'Not found', message: 'Memo not found', statusCode: 404 }
    }
    memos[idx] = { ...memos[idx], ...updates, version: memos[idx].version + 1 }
    return { data: memos[idx] }
  })

  // ── Votes ──────────────────────────────────────────────────────────

  app.get('/api/v1/memos/:memoId/votes', async (request) => {
    const { memoId } = request.params as { memoId: string }
    const memoVotes = votes.filter((v) => v.memoId === memoId)
    return { data: memoVotes }
  })

  app.post('/api/v1/memos/:memoId/votes', async (request) => {
    const { memoId } = request.params as { memoId: string }
    const body = request.body as { voterId: string; vote: IcVote; rationale?: string }
    const memo = memos.find((m) => m.id === memoId)
    if (!memo) {
      return { error: 'Not found', message: 'Memo not found', statusCode: 404 }
    }

    // Update existing vote or create new one
    const existingIdx = votes.findIndex(
      (v) => v.memoId === memoId && v.voterId === body.voterId,
    )
    const vote: IcVoteRecord = {
      id: existingIdx >= 0 ? votes[existingIdx].id : crypto.randomUUID(),
      memoId,
      ...body,
    }
    if (existingIdx >= 0) {
      votes[existingIdx] = vote
    } else {
      votes.push(vote)
    }
    return { data: vote }
  })

  // ── Vote Summary ──────────────────────────────────────────────────

  app.get('/api/v1/memos/:memoId/votes/summary', async (request) => {
    const { memoId } = request.params as { memoId: string }
    const memoVotes = votes.filter((v) => v.memoId === memoId)
    const summary = {
      total: memoVotes.length,
      invest: memoVotes.filter((v) => v.vote === 'invest').length,
      pass: memoVotes.filter((v) => v.vote === 'pass').length,
      'follow-up': memoVotes.filter((v) => v.vote === 'follow-up').length,
      abstain: memoVotes.filter((v) => v.vote === 'abstain').length,
    }
    return { data: summary }
  })

  // ── IC Rules Configuration ────────────────────────────────────────

  app.get('/api/v1/ic/config', async () => {
    return { data: IC_RULES }
  })

  // ── IC Decision Evaluation ────────────────────────────────────────

  app.post('/api/v1/memos/:memoId/evaluate-decision', async (request) => {
    const { memoId } = request.params as { memoId: string }
    const body = request.body as {
      checkSize: number
      foundingPrincipalVoterId: string
    }

    const memo = memos.find((m) => m.id === memoId)
    if (!memo) return { error: 'Not found', message: 'Memo not found', statusCode: 404 }

    const memoVotes = votes.filter((v) => v.memoId === memoId)
    const investVotes = memoVotes.filter((v) => v.vote === 'invest')
    const hasQuorum = memoVotes.length >= IC_RULES.quorum
    const foundingPrincipalVoted = memoVotes.some((v) => v.voterId === body.foundingPrincipalVoterId)
    const foundingPrincipalApproved = investVotes.some((v) => v.voterId === body.foundingPrincipalVoterId)
    const requiresUnanimous = body.checkSize > IC_RULES.unanimousThreshold
    const unanimousInvest = investVotes.length === memoVotes.length && memoVotes.length >= IC_RULES.quorum

    const issues: string[] = []
    if (!hasQuorum) issues.push(`Quorum not met: ${memoVotes.length}/${IC_RULES.quorum} required`)
    if (!foundingPrincipalVoted) issues.push('Founding Principal has not voted')
    if (foundingPrincipalVoted && !foundingPrincipalApproved) issues.push('Founding Principal did not vote to invest')
    if (requiresUnanimous && !unanimousInvest) issues.push(`Checks above $${(IC_RULES.unanimousThreshold / 1e6).toFixed(0)}M require unanimous invest vote`)

    const canProceed = hasQuorum && foundingPrincipalApproved && (!requiresUnanimous || unanimousInvest)

    return {
      data: {
        memoId,
        checkSize: body.checkSize,
        voteSummary: { total: memoVotes.length, invest: investVotes.length },
        hasQuorum,
        foundingPrincipalApproved,
        requiresUnanimous,
        unanimousInvest,
        canProceed,
        issues,
        rules: IC_RULES,
      },
    }
  })

  // ── Meeting Cadence ───────────────────────────────────────────────

  app.get('/api/v1/ic/meeting-cadence', async () => {
    return {
      data: {
        dealReview: { frequency: IC_RULES.meetingCadence.dealReview, description: 'Weekly deal review — pipeline status updates' },
        formalIC: { frequency: IC_RULES.meetingCadence.formalIC, description: 'Monthly IC meeting — formal investment votes' },
        rules: {
          quorum: `${IC_RULES.quorum} of ${IC_RULES.totalMembers} members`,
          foundingPrincipalRequired: IC_RULES.foundingPrincipalVoteRequired,
          unanimousThreshold: `First checks above $${(IC_RULES.unanimousThreshold / 1e6).toFixed(0)}M require unanimous vote`,
        },
      },
    }
  })
}
