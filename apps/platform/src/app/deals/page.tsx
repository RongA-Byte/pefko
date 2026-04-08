import type { Metadata } from 'next'
import { DEAL_STAGES } from '@arca/shared'

export const metadata: Metadata = { title: 'Deal Pipeline' }

const stageLabels: Record<string, string> = {
  sourced: 'Sourced',
  'first-meeting': 'First Meeting',
  'deep-dive': 'Deep Dive',
  'ic-review': 'IC Review',
  'term-sheet': 'Term Sheet',
  closed: 'Closed',
  passed: 'Passed',
}

export default function DealsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Deal Pipeline</h1>
      <p className="mt-1 text-sm text-[var(--color-muted)]">
        Track deals from sourcing through close
      </p>

      <div className="mt-8 flex gap-3 overflow-x-auto pb-4">
        {DEAL_STAGES.filter((s) => s !== 'passed').map((stage) => (
          <div
            key={stage}
            className="min-w-[200px] flex-shrink-0 rounded-xl border border-[var(--color-border)] bg-white p-4"
          >
            <h3 className="text-sm font-semibold">{stageLabels[stage]}</h3>
            <div className="mt-4 rounded-lg border border-dashed border-[var(--color-border)] p-6 text-center text-xs text-[var(--color-muted)]">
              No deals
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
