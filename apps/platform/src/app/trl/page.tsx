import type { Metadata } from 'next'
import { TRL_LABELS, SECTORS } from '@arca/shared'

export const metadata: Metadata = { title: 'TRL Scoring' }

const sectorLabels: Record<string, string> = {
  ai: 'AI & Machine Learning',
  'space-aero': 'Space & Aerospace',
  'bio-medical': 'Bio & Medical',
  opportunistic: 'Opportunistic',
}

export default function TrlScoringPage() {
  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">TRL Scoring</h1>
          <p className="mt-1 text-sm text-[var(--color-muted)]">
            Technology Readiness Level assessment framework
          </p>
        </div>
      </div>

      {/* TRL Scale Reference */}
      <div className="mt-8 rounded-xl border border-[var(--color-border)] bg-white p-6">
        <h2 className="font-semibold">TRL Scale Reference</h2>
        <div className="mt-4 space-y-2">
          {Object.entries(TRL_LABELS).map(([level, label]) => (
            <div
              key={level}
              className="flex items-center gap-4 rounded-lg p-2 transition-colors hover:bg-[var(--color-bg-alt)]"
            >
              <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[var(--color-accent)] text-sm font-bold text-white">
                {level}
              </span>
              <span className="text-sm">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Sector Rubrics */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold">Sector-Specific Rubrics</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
          {SECTORS.map((sector) => (
            <div
              key={sector}
              className="rounded-xl border border-[var(--color-border)] bg-white p-6"
            >
              <h3 className="font-semibold">{sectorLabels[sector]}</h3>
              <p className="mt-2 text-sm text-[var(--color-muted)]">
                Scoring criteria tailored for {sectorLabels[sector].toLowerCase()} investments.
              </p>
              <div className="mt-4">
                <div className="text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)]">
                  Assessment areas
                </div>
                <ul className="mt-2 space-y-1 text-sm">
                  <li className="text-[var(--color-muted)]">Technology maturity</li>
                  <li className="text-[var(--color-muted)]">Market readiness</li>
                  <li className="text-[var(--color-muted)]">Team capability</li>
                  <li className="text-[var(--color-muted)]">Regulatory position</li>
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Assessments placeholder */}
      <div className="mt-8 rounded-xl border border-dashed border-[var(--color-border)] bg-white p-8 text-center">
        <p className="font-semibold text-[var(--color-muted)]">No assessments yet</p>
        <p className="mt-1 text-sm text-[var(--color-muted)]">
          TRL assessments will appear here once deals are added to the pipeline.
        </p>
      </div>
    </div>
  )
}
