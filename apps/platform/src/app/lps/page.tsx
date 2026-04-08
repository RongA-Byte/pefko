import type { Metadata } from 'next'
import Link from 'next/link'
import { KYC_STATUSES } from '@arca/shared'

export const metadata: Metadata = { title: 'LP Management' }

const statusColors: Record<string, string> = {
  pending: 'bg-gray-100 text-gray-700',
  'documents-submitted': 'bg-blue-100 text-blue-700',
  'under-review': 'bg-yellow-100 text-yellow-700',
  approved: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
  expired: 'bg-orange-100 text-orange-700',
}

const statusLabels: Record<string, string> = {
  pending: 'Pending',
  'documents-submitted': 'Docs Submitted',
  'under-review': 'Under Review',
  approved: 'Approved',
  rejected: 'Rejected',
  expired: 'Expired',
}

export default function LpsPage() {
  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">LP Management</h1>
          <p className="mt-1 text-sm text-[var(--color-muted)]">
            Limited partner tracking, onboarding, and compliance
          </p>
        </div>
        <Link
          href="/compliance/onboard"
          className="rounded-lg bg-[var(--color-accent)] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[var(--color-accent-light)]"
        >
          Onboard New LP
        </Link>
      </div>

      {/* Quick Links */}
      <div className="mt-6 flex gap-3">
        <Link
          href="/compliance"
          className="rounded-lg border border-[var(--color-border)] px-4 py-2 text-sm font-medium transition-colors hover:bg-[var(--color-bg-alt)]"
        >
          AML/KYC Dashboard
        </Link>
        <Link
          href="/dataroom"
          className="rounded-lg border border-[var(--color-border)] px-4 py-2 text-sm font-medium transition-colors hover:bg-[var(--color-bg-alt)]"
        >
          Data Room
        </Link>
      </div>

      {/* LP Table Placeholder */}
      <div className="mt-8 rounded-xl border border-[var(--color-border)] bg-white">
        <div className="border-b border-[var(--color-border)] p-4">
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Search LPs..."
              className="w-64 rounded-lg border border-[var(--color-border)] px-3 py-1.5 text-sm outline-none focus:border-[var(--color-accent)]"
            />
            <div className="flex gap-2">
              {KYC_STATUSES.map((status) => (
                <button
                  key={status}
                  className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[status]} opacity-60 hover:opacity-100`}
                >
                  {statusLabels[status]}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="p-8 text-center">
          <p className="font-semibold text-[var(--color-muted)]">No LPs onboarded yet</p>
          <p className="mt-1 text-sm text-[var(--color-muted)]">
            Use the &ldquo;Onboard New LP&rdquo; button to begin investor onboarding.
          </p>
        </div>
      </div>
    </div>
  )
}
