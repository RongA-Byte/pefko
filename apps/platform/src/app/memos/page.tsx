import type { Metadata } from 'next'
import { MEMO_TYPES } from '@arca/shared'

export const metadata: Metadata = { title: 'IC Memos' }

const typeLabels: Record<string, { label: string; description: string }> = {
  'sourcing-note': {
    label: 'Sourcing Note',
    description: 'Initial deal assessment and thesis fit',
  },
  'deep-dive': {
    label: 'Deep Dive',
    description: 'Comprehensive analysis with diligence checklist',
  },
  'ic-memo': {
    label: 'IC Memo',
    description: 'Investment committee presentation document',
  },
  decision: {
    label: 'Decision Record',
    description: 'Final IC decision with vote tally and rationale',
  },
}

export default function MemosPage() {
  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">IC Memos</h1>
          <p className="mt-1 text-sm text-[var(--color-muted)]">
            Investment committee memo workflow and decision tracking
          </p>
        </div>
      </div>

      {/* Memo Workflow */}
      <div className="mt-8 rounded-xl border border-[var(--color-border)] bg-white p-6">
        <h2 className="font-semibold">Memo Workflow</h2>
        <div className="mt-4 flex items-center gap-2">
          {MEMO_TYPES.map((type, i) => (
            <div key={type} className="flex items-center gap-2">
              <div className="rounded-lg border border-[var(--color-border)] px-4 py-3">
                <p className="text-sm font-medium">{typeLabels[type].label}</p>
                <p className="mt-0.5 text-xs text-[var(--color-muted)]">
                  {typeLabels[type].description}
                </p>
              </div>
              {i < MEMO_TYPES.length - 1 && (
                <span className="text-[var(--color-muted)]">&rarr;</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* IC Voting */}
      <div className="mt-6 rounded-xl border border-[var(--color-border)] bg-white p-6">
        <h2 className="font-semibold">IC Voting Process</h2>
        <p className="mt-2 text-sm text-[var(--color-muted)]">
          Each IC memo supports structured voting with four options:
        </p>
        <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
          {[
            { vote: 'Invest', color: 'bg-green-100 text-green-800' },
            { vote: 'Pass', color: 'bg-red-100 text-red-800' },
            { vote: 'Follow-up', color: 'bg-yellow-100 text-yellow-800' },
            { vote: 'Abstain', color: 'bg-gray-100 text-gray-800' },
          ].map((item) => (
            <div
              key={item.vote}
              className={`rounded-lg px-4 py-3 text-center text-sm font-medium ${item.color}`}
            >
              {item.vote}
            </div>
          ))}
        </div>
      </div>

      {/* Diligence Templates */}
      <div className="mt-6 rounded-xl border border-[var(--color-border)] bg-white p-6">
        <h2 className="font-semibold">Sector Diligence Templates</h2>
        <p className="mt-2 text-sm text-[var(--color-muted)]">
          Pre-configured diligence checklists for each sector, automatically attached to deep-dive
          and IC memos.
        </p>
        <div className="mt-4 flex gap-3">
          {['AI & ML', 'Space & Aero', 'Bio & Medical'].map((sector) => (
            <span
              key={sector}
              className="rounded-full border border-[var(--color-border)] px-3 py-1 text-xs font-medium"
            >
              {sector} — 10 items
            </span>
          ))}
        </div>
      </div>

      {/* Recent Memos placeholder */}
      <div className="mt-8 rounded-xl border border-dashed border-[var(--color-border)] bg-white p-8 text-center">
        <p className="font-semibold text-[var(--color-muted)]">No memos yet</p>
        <p className="mt-1 text-sm text-[var(--color-muted)]">
          IC memos will appear here once deals progress through the pipeline.
        </p>
      </div>
    </div>
  )
}
