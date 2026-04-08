import Link from 'next/link'

const stats = [
  { label: 'Active Deals', value: '—', href: '/deals' },
  { label: 'IC Memos', value: '—', href: '/memos' },
  { label: 'LP Commitments', value: '—', href: '/lps' },
  { label: 'Portfolio Companies', value: '—', href: '/portfolio' },
]

export default function Dashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="mt-1 text-sm text-[var(--color-muted)]">
        ARCA fund management overview
      </p>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="rounded-xl border border-[var(--color-border)] bg-white p-6 transition-shadow hover:shadow-sm"
          >
            <p className="text-sm text-[var(--color-muted)]">{stat.label}</p>
            <p className="mt-2 text-3xl font-bold">{stat.value}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-[var(--color-border)] bg-white p-6">
          <h2 className="font-semibold">Recent Activity</h2>
          <p className="mt-4 text-sm text-[var(--color-muted)]">
            No activity yet. Start by adding deals to the pipeline.
          </p>
        </div>
        <div className="rounded-xl border border-[var(--color-border)] bg-white p-6">
          <h2 className="font-semibold">Upcoming IC Meetings</h2>
          <p className="mt-4 text-sm text-[var(--color-muted)]">
            No meetings scheduled.
          </p>
        </div>
      </div>
    </div>
  )
}
