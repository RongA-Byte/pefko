import type { Metadata } from 'next'
import Link from 'next/link'
import { DEAL_STAGES, SECTORS, LP_PIPELINE_STAGES } from '@arca/shared'

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

const stageColors: Record<string, string> = {
  sourced: 'border-t-gray-400',
  'first-meeting': 'border-t-blue-400',
  'deep-dive': 'border-t-indigo-400',
  'ic-review': 'border-t-purple-400',
  'term-sheet': 'border-t-amber-400',
  closed: 'border-t-green-400',
  passed: 'border-t-red-300',
}

const sectorLabels: Record<string, string> = {
  ai: 'AI',
  'space-aero': 'Space & Aero',
  'bio-medical': 'Bio & Medical',
}

const sectorBadgeColors: Record<string, string> = {
  ai: 'bg-violet-100 text-violet-700',
  'space-aero': 'bg-sky-100 text-sky-700',
  'bio-medical': 'bg-emerald-100 text-emerald-700',
}

const lpStageLabels: Record<string, string> = {
  prospecting: 'Prospecting',
  'intro-call': 'Intro Call',
  'data-room-access': 'Data Room Access',
  commitment: 'Commitment',
  closed: 'Closed',
}

export default function DealsPage() {
  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Deal Pipeline</h1>
          <p className="mt-1 text-sm text-[var(--color-muted)]">
            Track deals from sourcing through close &middot; Syncs with Affinity CRM
          </p>
        </div>
        <div className="flex gap-2">
          <button className="rounded-lg border border-[var(--color-border)] px-4 py-2 text-sm font-medium transition-colors hover:bg-[var(--color-bg-alt)]">
            Import from Affinity
          </button>
          <button className="rounded-lg bg-[var(--color-accent)] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[var(--color-accent-light)]">
            + New Deal
          </button>
        </div>
      </div>

      {/* Pipeline Stats */}
      <div className="mt-6 grid grid-cols-4 gap-4">
        <div className="rounded-xl border border-[var(--color-border)] bg-white p-4">
          <p className="text-xs font-medium text-[var(--color-muted)]">Active Deals</p>
          <p className="mt-1 text-2xl font-bold">0</p>
        </div>
        <div className="rounded-xl border border-[var(--color-border)] bg-white p-4">
          <p className="text-xs font-medium text-[var(--color-muted)]">Total Check Size</p>
          <p className="mt-1 text-2xl font-bold">$0</p>
        </div>
        <div className="rounded-xl border border-[var(--color-border)] bg-white p-4">
          <p className="text-xs font-medium text-[var(--color-muted)]">Avg TRL Score</p>
          <p className="mt-1 text-2xl font-bold">&mdash;</p>
        </div>
        <div className="rounded-xl border border-[var(--color-border)] bg-white p-4">
          <p className="text-xs font-medium text-[var(--color-muted)]">Affinity Sync</p>
          <p className="mt-1 text-sm font-medium text-amber-600">Awaiting credentials</p>
        </div>
      </div>

      {/* Filters */}
      <div className="mt-6 flex items-center gap-3">
        <div className="flex gap-2">
          {SECTORS.map((sector) => (
            <button
              key={sector}
              className={`rounded-full px-3 py-1 text-xs font-medium ${sectorBadgeColors[sector]} opacity-70 hover:opacity-100 transition-opacity`}
            >
              {sectorLabels[sector]}
            </button>
          ))}
        </div>
        <div className="mx-2 h-4 w-px bg-[var(--color-border)]" />
        <input
          type="text"
          placeholder="Search deals..."
          className="w-56 rounded-lg border border-[var(--color-border)] px-3 py-1.5 text-sm outline-none focus:border-[var(--color-accent)]"
        />
      </div>

      {/* Kanban Pipeline */}
      <div className="mt-6 flex gap-3 overflow-x-auto pb-4">
        {DEAL_STAGES.filter((s) => s !== 'passed').map((stage) => (
          <div
            key={stage}
            className={`min-w-[220px] flex-shrink-0 rounded-xl border border-[var(--color-border)] border-t-4 ${stageColors[stage]} bg-white`}
          >
            <div className="flex items-center justify-between p-4 pb-2">
              <h3 className="text-sm font-semibold">{stageLabels[stage]}</h3>
              <span className="rounded-full bg-[var(--color-bg-alt)] px-2 py-0.5 text-xs font-medium text-[var(--color-muted)]">
                0
              </span>
            </div>
            <div className="px-4 pb-4">
              <div className="rounded-lg border border-dashed border-[var(--color-border)] p-6 text-center text-xs text-[var(--color-muted)]">
                No deals
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* LP Pipeline Section */}
      <div className="mt-10">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">LP Tracking Pipeline</h2>
            <p className="mt-1 text-sm text-[var(--color-muted)]">
              Track LP relationships from prospecting through commitment
            </p>
          </div>
          <div className="flex gap-2">
            <button className="rounded-lg border border-[var(--color-border)] px-4 py-2 text-sm font-medium transition-colors hover:bg-[var(--color-bg-alt)]">
              Sync from Affinity
            </button>
            <Link
              href="/lps"
              className="rounded-lg border border-[var(--color-border)] px-4 py-2 text-sm font-medium transition-colors hover:bg-[var(--color-bg-alt)]"
            >
              LP Management
            </Link>
          </div>
        </div>

        <div className="mt-4 flex gap-3 overflow-x-auto pb-4">
          {LP_PIPELINE_STAGES.map((stage) => (
            <div
              key={stage}
              className="min-w-[200px] flex-shrink-0 rounded-xl border border-[var(--color-border)] bg-white p-4"
            >
              <h3 className="text-sm font-semibold">{lpStageLabels[stage]}</h3>
              <div className="mt-4 rounded-lg border border-dashed border-[var(--color-border)] p-6 text-center text-xs text-[var(--color-muted)]">
                No LPs
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Co-Investor Network */}
      <div className="mt-10">
        <h2 className="text-xl font-bold">Co-Investor Network</h2>
        <p className="mt-1 text-sm text-[var(--color-muted)]">
          Track co-investor relationships across deals &middot; Powered by Affinity relationship intelligence
        </p>
        <div className="mt-4 rounded-xl border border-[var(--color-border)] bg-white p-8 text-center">
          <p className="font-semibold text-[var(--color-muted)]">No co-investor data yet</p>
          <p className="mt-1 text-sm text-[var(--color-muted)]">
            Add co-investors to deals or sync from Affinity to populate the network view.
          </p>
        </div>
      </div>

      {/* Integration Status */}
      <div className="mt-10 rounded-xl border border-amber-200 bg-amber-50 p-4">
        <h3 className="text-sm font-semibold text-amber-800">Affinity CRM Integration</h3>
        <p className="mt-1 text-sm text-amber-700">
          Integration scaffolding is ready. Awaiting Affinity account credentials to activate:
        </p>
        <ul className="mt-2 space-y-1 text-sm text-amber-700">
          <li>&#x2022; Affinity API key &rarr; <code className="rounded bg-amber-100 px-1.5 py-0.5 text-xs">AFFINITY_API_KEY</code></li>
          <li>&#x2022; Deal flow list ID &rarr; <code className="rounded bg-amber-100 px-1.5 py-0.5 text-xs">AFFINITY_DEAL_LIST_ID</code></li>
          <li>&#x2022; LP tracking list ID &rarr; <code className="rounded bg-amber-100 px-1.5 py-0.5 text-xs">AFFINITY_LP_LIST_ID</code></li>
        </ul>
        <p className="mt-2 text-xs text-amber-600">
          Once configured, two-way sync between ARCA platform and Affinity will be active.
        </p>
      </div>
    </div>
  )
}
