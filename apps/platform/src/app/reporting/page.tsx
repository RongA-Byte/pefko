import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'LP Reporting' }

const reportSections = [
  {
    key: 'fund-overview',
    title: 'Fund Overview',
    description: 'NAV, TVPI, DPI, RVPI, IRR summary, fund parameters',
    required: true,
    source: 'Fund Admin',
  },
  {
    key: 'portfolio-status',
    title: 'Portfolio Status',
    description: 'Status of each portfolio company, TRL progression, key developments',
    required: true,
    source: 'Internal + Fund Admin',
  },
  {
    key: 'valuations',
    title: 'Valuations',
    description: 'Current valuations for all portfolio companies with methodology notes',
    required: true,
    source: 'Fund Admin',
  },
  {
    key: 'capital-deployed',
    title: 'Capital Deployed',
    description: 'Capital deployed during the period, cumulative deployment, remaining dry powder',
    required: true,
    source: 'Fund Admin',
  },
  {
    key: 'returns',
    title: 'Returns',
    description: 'Gross and net returns, TVPI, DPI, RVPI, IRR by vintage and sector',
    required: true,
    source: 'Fund Admin',
  },
  {
    key: 'cash-flow',
    title: 'Cash Flow',
    description: 'Capital calls, distributions, management fees, and net cash flow for the period',
    required: true,
    source: 'Fund Admin',
  },
  {
    key: 'upcoming-financings',
    title: 'Upcoming Financings',
    description: 'Portfolio companies expected to raise follow-on rounds, co-investment opportunities',
    required: true,
    source: 'Internal',
  },
  {
    key: 'adverse-developments',
    title: 'Adverse Developments',
    description: 'Material adverse events, write-downs, or risk factors to disclose',
    required: true,
    source: 'Internal',
  },
  {
    key: 'capital-activity',
    title: 'Capital Activity',
    description: 'Capital calls and distributions during the period',
    required: true,
    source: 'Fund Admin',
  },
  {
    key: 'trl-progression',
    title: 'TRL Progression Report',
    description: 'Technology readiness advancement per portfolio company (ARCA custom supplement)',
    required: false,
    source: 'Internal (ARCA custom)',
  },
  {
    key: 'sector-intelligence',
    title: 'Sector Market Intelligence',
    description: 'Market analysis for AI, Space/Aero, Bio/Medical, and Opportunistic sectors',
    required: false,
    source: 'Internal (ARCA custom)',
  },
  {
    key: 'co-investment',
    title: 'Co-Investment Opportunities',
    description: 'Available co-investment opportunities for LPs (ARCA custom supplement)',
    required: false,
    source: 'Internal (ARCA custom)',
  },
  {
    key: 'market-commentary',
    title: 'Market Commentary',
    description: 'GP perspective on market conditions and outlook',
    required: false,
    source: 'Internal (ARCA custom)',
  },
]

export default function ReportingPage() {
  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">LP Reporting</h1>
          <p className="mt-1 text-sm text-[var(--color-muted)]">
            Quarterly report generation with custom TRL and sector supplements
          </p>
        </div>
        <div className="flex gap-2">
          <button className="rounded-lg bg-[var(--color-accent)] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[var(--color-accent-light)]">
            + New Report
          </button>
        </div>
      </div>

      {/* Report Overview Stats */}
      <div className="mt-6 grid grid-cols-4 gap-4">
        <div className="rounded-xl border border-[var(--color-border)] bg-white p-4">
          <p className="text-xs font-medium text-[var(--color-muted)]">Total Reports</p>
          <p className="mt-1 text-2xl font-bold">0</p>
        </div>
        <div className="rounded-xl border border-[var(--color-border)] bg-white p-4">
          <p className="text-xs font-medium text-[var(--color-muted)]">Published</p>
          <p className="mt-1 text-2xl font-bold">0</p>
        </div>
        <div className="rounded-xl border border-[var(--color-border)] bg-white p-4">
          <p className="text-xs font-medium text-[var(--color-muted)]">In Draft</p>
          <p className="mt-1 text-2xl font-bold">0</p>
        </div>
        <div className="rounded-xl border border-[var(--color-border)] bg-white p-4">
          <p className="text-xs font-medium text-[var(--color-muted)]">Last Published</p>
          <p className="mt-1 text-sm font-medium text-[var(--color-muted)]">&mdash;</p>
        </div>
      </div>

      {/* Report Template */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold">Quarterly Report Template</h2>
        <p className="mt-1 text-sm text-[var(--color-muted)]">
          Standard sections plus ARCA custom supplements (TRL progression, sector intel, co-investment)
        </p>

        <div className="mt-4 space-y-3">
          {reportSections.map((section) => (
            <div
              key={section.key}
              className="flex items-center justify-between rounded-xl border border-[var(--color-border)] bg-white p-4"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold ${
                    section.required
                      ? 'bg-[var(--color-accent)] text-white'
                      : 'bg-violet-100 text-violet-700'
                  }`}
                >
                  {section.required ? 'R' : 'C'}
                </div>
                <div>
                  <p className="text-sm font-semibold">{section.title}</p>
                  <p className="text-xs text-[var(--color-muted)]">{section.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="rounded-full bg-[var(--color-bg-alt)] px-2.5 py-0.5 text-xs font-medium text-[var(--color-muted)]">
                  {section.source}
                </span>
                {section.required ? (
                  <span className="text-xs font-medium text-[var(--color-muted)]">Required</span>
                ) : (
                  <span className="text-xs font-medium text-violet-600">Custom</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reports List */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold">Report History</h2>
        <div className="mt-4 overflow-hidden rounded-xl border border-[var(--color-border)] bg-white">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)] bg-[var(--color-bg-alt)]">
                <th className="px-4 py-3 font-medium text-[var(--color-muted)]">Period</th>
                <th className="px-4 py-3 font-medium text-[var(--color-muted)]">Type</th>
                <th className="px-4 py-3 font-medium text-[var(--color-muted)]">Status</th>
                <th className="px-4 py-3 font-medium text-[var(--color-muted)]">Sections</th>
                <th className="px-4 py-3 font-medium text-[var(--color-muted)]">Published</th>
                <th className="px-4 py-3 font-medium text-[var(--color-muted)]">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-[var(--color-muted)]">
                  No reports yet. Create your first quarterly report after the fund&rsquo;s first close.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Report Generation Workflow */}
      <div className="mt-8 rounded-xl border border-[var(--color-border)] bg-white p-6">
        <h2 className="font-semibold">Report Generation Workflow</h2>
        <div className="mt-4 flex items-center gap-3">
          <div className="flex flex-1 items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--color-accent)] text-xs font-bold text-white">
              1
            </span>
            <span className="text-sm">Draft report</span>
          </div>
          <div className="h-px w-8 bg-[var(--color-border)]" />
          <div className="flex flex-1 items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--color-bg-alt)] text-xs font-bold text-[var(--color-muted)]">
              2
            </span>
            <span className="text-sm text-[var(--color-muted)]">Pull fund metrics</span>
          </div>
          <div className="h-px w-8 bg-[var(--color-border)]" />
          <div className="flex flex-1 items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--color-bg-alt)] text-xs font-bold text-[var(--color-muted)]">
              3
            </span>
            <span className="text-sm text-[var(--color-muted)]">Add TRL supplements</span>
          </div>
          <div className="h-px w-8 bg-[var(--color-border)]" />
          <div className="flex flex-1 items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--color-bg-alt)] text-xs font-bold text-[var(--color-muted)]">
              4
            </span>
            <span className="text-sm text-[var(--color-muted)]">GP review</span>
          </div>
          <div className="h-px w-8 bg-[var(--color-border)]" />
          <div className="flex flex-1 items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--color-bg-alt)] text-xs font-bold text-[var(--color-muted)]">
              5
            </span>
            <span className="text-sm text-[var(--color-muted)]">Publish to LPs</span>
          </div>
        </div>
      </div>

      {/* Data Source Integration */}
      <div className="mt-8 rounded-xl border border-green-200 bg-green-50 p-4">
        <h3 className="text-sm font-semibold text-green-800">Report Data Sources</h3>
        <p className="mt-1 text-sm text-green-700">
          Quarterly reports combine built-in fund admin output with ARCA custom supplements:
        </p>
        <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
          <div className="rounded-lg bg-white p-3">
            <p className="text-xs font-semibold">Standard (Fund Admin)</p>
            <p className="mt-1 text-xs text-green-600">Active</p>
            <ul className="mt-2 space-y-1 text-xs text-[var(--color-muted)]">
              <li>&bull; Fund financial statements</li>
              <li>&bull; Capital account statements</li>
              <li>&bull; K-1 tax documents</li>
              <li>&bull; Capital call / distribution notices</li>
            </ul>
          </div>
          <div className="rounded-lg bg-white p-3">
            <p className="text-xs font-semibold">Custom Supplements (ARCA Platform)</p>
            <p className="mt-1 text-xs text-green-600">Ready</p>
            <ul className="mt-2 space-y-1 text-xs text-[var(--color-muted)]">
              <li>&bull; TRL progression narratives per company</li>
              <li>&bull; Sector market intelligence summaries</li>
              <li>&bull; Co-investment opportunity highlights</li>
              <li>&bull; Deep-tech milestone tracking</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
