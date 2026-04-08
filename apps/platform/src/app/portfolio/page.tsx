import type { Metadata } from 'next'
import { SECTORS } from '@arca/shared'

export const metadata: Metadata = { title: 'Portfolio' }

const sectorLabels: Record<string, string> = {
  ai: 'AI & ML',
  'space-aero': 'Space & Aero',
  'bio-medical': 'Bio & Medical',
}

const sectorBadgeColors: Record<string, string> = {
  ai: 'bg-violet-100 text-violet-700',
  'space-aero': 'bg-sky-100 text-sky-700',
  'bio-medical': 'bg-emerald-100 text-emerald-700',
}

function MetricCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-white p-4">
      <p className="text-xs font-medium text-[var(--color-muted)]">{label}</p>
      <p className="mt-1 text-2xl font-bold">{value}</p>
      {sub && <p className="mt-0.5 text-xs text-[var(--color-muted)]">{sub}</p>}
    </div>
  )
}

export default function PortfolioPage() {
  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Portfolio Dashboard</h1>
          <p className="mt-1 text-sm text-[var(--color-muted)]">
            Portfolio company monitoring, performance analytics, and TRL progression
          </p>
        </div>
        <div className="flex gap-2">
          <button className="rounded-lg border border-[var(--color-border)] px-4 py-2 text-sm font-medium transition-colors hover:bg-[var(--color-bg-alt)]">
            Export Report
          </button>
          <button className="rounded-lg bg-[var(--color-accent)] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[var(--color-accent-light)]">
            + Add Company
          </button>
        </div>
      </div>

      {/* Fund-Level Metrics */}
      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-5">
        <MetricCard label="Total Invested" value="$0" />
        <MetricCard label="NAV" value="$0" />
        <MetricCard label="TVPI (Gross)" value="0.00x" sub="Net: 0.00x" />
        <MetricCard label="DPI" value="0.00x" sub="Distributions / Invested" />
        <MetricCard label="RVPI" value="0.00x" sub="Unrealized / Invested" />
      </div>

      {/* Sector Allocation */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold">Sector Allocation</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
          {SECTORS.map((sector) => (
            <div
              key={sector}
              className="rounded-xl border border-[var(--color-border)] bg-white p-5"
            >
              <div className="flex items-center justify-between">
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${sectorBadgeColors[sector]}`}
                >
                  {sectorLabels[sector]}
                </span>
                <span className="text-sm font-semibold text-[var(--color-muted)]">0 companies</span>
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--color-muted)]">Invested</span>
                  <span className="font-medium">$0</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--color-muted)]">Current Value</span>
                  <span className="font-medium">$0</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--color-muted)]">Avg TRL</span>
                  <span className="font-medium">&mdash;</span>
                </div>
              </div>
              <div className="mt-3">
                <div className="h-2 w-full rounded-full bg-[var(--color-bg-alt)]">
                  <div className="h-2 rounded-full bg-[var(--color-accent)]" style={{ width: '0%' }} />
                </div>
                <p className="mt-1 text-right text-xs text-[var(--color-muted)]">0% of portfolio</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Return Metrics and TRL Progression */}
      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-[var(--color-border)] bg-white p-6">
          <h2 className="font-semibold">Return Metrics Over Time</h2>
          <p className="mt-1 text-xs text-[var(--color-muted)]">TVPI, DPI, RVPI trend</p>
          <div className="mt-4 flex h-48 items-center justify-center rounded-lg bg-[var(--color-bg-alt)]">
            <div className="text-center">
              <p className="text-sm font-medium text-[var(--color-muted)]">Chart available after first investment</p>
              <p className="mt-1 text-xs text-[var(--color-muted)]">
                NAV, TVPI, DPI, RVPI, IRR tracked quarterly
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-[var(--color-border)] bg-white p-6">
          <h2 className="font-semibold">TRL Progression</h2>
          <p className="mt-1 text-xs text-[var(--color-muted)]">Technology readiness advancement across portfolio</p>
          <div className="mt-4 flex h-48 items-center justify-center rounded-lg bg-[var(--color-bg-alt)]">
            <div className="text-center">
              <p className="text-sm font-medium text-[var(--color-muted)]">TRL tracking starts at investment</p>
              <p className="mt-1 text-xs text-[var(--color-muted)]">
                Sector-specific scoring (AI, Space/Aero, Bio)
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Portfolio Companies Table */}
      <div className="mt-8">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Portfolio Companies</h2>
          <div className="flex gap-2">
            {SECTORS.map((sector) => (
              <button
                key={sector}
                className={`rounded-full px-3 py-1 text-xs font-medium ${sectorBadgeColors[sector]} opacity-70 transition-opacity hover:opacity-100`}
              >
                {sectorLabels[sector]}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4 overflow-hidden rounded-xl border border-[var(--color-border)] bg-white">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)] bg-[var(--color-bg-alt)]">
                <th className="px-4 py-3 font-medium text-[var(--color-muted)]">Company</th>
                <th className="px-4 py-3 font-medium text-[var(--color-muted)]">Sector</th>
                <th className="px-4 py-3 font-medium text-[var(--color-muted)]">Invested</th>
                <th className="px-4 py-3 font-medium text-[var(--color-muted)]">Valuation</th>
                <th className="px-4 py-3 font-medium text-[var(--color-muted)]">TRL</th>
                <th className="px-4 py-3 font-medium text-[var(--color-muted)]">Ownership</th>
                <th className="px-4 py-3 font-medium text-[var(--color-muted)]">Status</th>
                <th className="px-4 py-3 font-medium text-[var(--color-muted)]">MOIC</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={8} className="px-4 py-12 text-center text-[var(--color-muted)]">
                  No portfolio companies yet. Add companies after investment close.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Alerts & Co-Investor Performance */}
      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-[var(--color-border)] bg-white p-6">
          <h2 className="font-semibold">Material Event Alerts</h2>
          <p className="mt-1 text-xs text-[var(--color-muted)]">
            Down rounds, exits, key personnel changes, regulatory events
          </p>
          <div className="mt-4 rounded-lg border border-dashed border-[var(--color-border)] p-6 text-center">
            <p className="text-sm text-[var(--color-muted)]">No alerts</p>
          </div>
        </div>

        <div className="rounded-xl border border-[var(--color-border)] bg-white p-6">
          <h2 className="font-semibold">Co-Investor Performance</h2>
          <p className="mt-1 text-xs text-[var(--color-muted)]">
            Compare returns across co-investment partners
          </p>
          <div className="mt-4 rounded-lg border border-dashed border-[var(--color-border)] p-6 text-center">
            <p className="text-sm text-[var(--color-muted)]">No co-investment data yet</p>
          </div>
        </div>
      </div>

      {/* Integration Status */}
      <div className="mt-8 rounded-xl border border-amber-200 bg-amber-50 p-4">
        <h3 className="text-sm font-semibold text-amber-800">Data Sources</h3>
        <p className="mt-1 text-sm text-amber-700">
          Portfolio data integrations and their status:
        </p>
        <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-3">
          <div className="rounded-lg bg-white p-3">
            <p className="text-xs font-semibold">Carta Fund Admin</p>
            <p className="mt-1 text-xs text-amber-600">Awaiting credentials</p>
            <p className="mt-0.5 text-xs text-[var(--color-muted)]">
              NAV, capital calls, distributions
            </p>
          </div>
          <div className="rounded-lg bg-white p-3">
            <p className="text-xs font-semibold">Visible.vc</p>
            <p className="mt-1 text-xs text-amber-600">Awaiting setup</p>
            <p className="mt-0.5 text-xs text-[var(--color-muted)]">
              Portfolio company KPI collection
            </p>
          </div>
          <div className="rounded-lg bg-white p-3">
            <p className="text-xs font-semibold">Internal Platform</p>
            <p className="mt-1 text-xs text-green-600">Ready</p>
            <p className="mt-0.5 text-xs text-[var(--color-muted)]">
              TRL scoring, deal pipeline, IC memos
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
