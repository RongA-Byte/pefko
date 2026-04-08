import type { Metadata } from 'next'
import Link from 'next/link'
import { KYC_STATUSES } from '@arca/shared'

export const metadata: Metadata = { title: 'AML/KYC Compliance' }

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

export default function CompliancePage() {
  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">AML/KYC Compliance</h1>
          <p className="mt-1 text-sm text-[var(--color-muted)]">
            Investor onboarding, screening, and ongoing monitoring &mdash; powered by Steward
          </p>
        </div>
        <Link
          href="/compliance/onboard"
          className="rounded-lg bg-[var(--color-accent)] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[var(--color-accent-light)]"
        >
          Onboard New LP
        </Link>
      </div>

      {/* Dashboard Stats */}
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total LPs" value="0" />
        <StatCard label="Pending Review" value="0" accent />
        <StatCard label="Active Monitoring" value="0" />
        <StatCard label="High Risk Alerts" value="0" danger />
      </div>

      {/* Status Breakdown */}
      <div className="mt-8 rounded-xl border border-[var(--color-border)] bg-white p-6">
        <h2 className="font-semibold">KYC Status Overview</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          {KYC_STATUSES.map((status) => (
            <div key={status} className="flex items-center gap-2">
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[status]}`}
              >
                {statusLabels[status]}
              </span>
              <span className="text-sm text-[var(--color-muted)]">0</span>
            </div>
          ))}
        </div>
      </div>

      {/* Screening Pipeline */}
      <div className="mt-8 rounded-xl border border-[var(--color-border)] bg-white p-6">
        <h2 className="font-semibold">Screening Pipeline</h2>
        <p className="mt-1 text-sm text-[var(--color-muted)]">
          OFAC, PEP, adverse media, and source-of-funds screening via Steward
        </p>
        <div className="mt-6">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-[var(--color-border)]">
                  <th className="pb-3 pr-4 font-medium text-[var(--color-muted)]">Screening</th>
                  <th className="pb-3 pr-4 font-medium text-[var(--color-muted)]">Description</th>
                  <th className="pb-3 font-medium text-[var(--color-muted)]">Provider</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)]">
                <ScreeningRow
                  name="Identity Verification"
                  description="Document-based identity verification (passport, national ID)"
                  provider="Steward"
                />
                <ScreeningRow
                  name="OFAC Screening"
                  description="U.S. Treasury OFAC Specially Designated Nationals list check"
                  provider="Steward"
                />
                <ScreeningRow
                  name="PEP Screening"
                  description="Politically Exposed Persons database screening"
                  provider="Steward"
                />
                <ScreeningRow
                  name="Adverse Media"
                  description="AI-driven negative news and adverse media monitoring"
                  provider="Steward"
                />
                <ScreeningRow
                  name="Source of Funds"
                  description="Verification of investment capital origin and legitimacy"
                  provider="Steward"
                />
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Required Documents Reference */}
      <div className="mt-8 rounded-xl border border-[var(--color-border)] bg-white p-6">
        <h2 className="font-semibold">Required Documents by LP Type</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <DocRequirement
            lpType="Individual"
            docs={['Passport', 'Proof of Address', 'Source of Funds Declaration', 'Bank Statement']}
          />
          <DocRequirement
            lpType="Family Office"
            docs={['Passport', 'Proof of Address', 'Source of Funds Declaration', 'Bank Statement', 'Beneficial Ownership']}
          />
          <DocRequirement
            lpType="Institutional"
            docs={['Corporate Registration', 'Proof of Address', 'Source of Funds Declaration', 'Beneficial Ownership']}
          />
        </div>
      </div>

      {/* Recent Activity placeholder */}
      <div className="mt-8 rounded-xl border border-dashed border-[var(--color-border)] bg-white p-8 text-center">
        <p className="font-semibold text-[var(--color-muted)]">No compliance activity yet</p>
        <p className="mt-1 text-sm text-[var(--color-muted)]">
          Onboard your first LP to begin the AML/KYC screening process.
        </p>
      </div>
    </div>
  )
}

function StatCard({ label, value, accent, danger }: { label: string; value: string; accent?: boolean; danger?: boolean }) {
  let valueColor = 'text-[var(--color-primary)]'
  if (accent) valueColor = 'text-[var(--color-accent)]'
  if (danger) valueColor = 'text-[var(--color-danger)]'

  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-white p-5">
      <p className="text-xs font-medium uppercase tracking-wider text-[var(--color-muted)]">{label}</p>
      <p className={`mt-2 text-2xl font-bold ${valueColor}`}>{value}</p>
    </div>
  )
}

function ScreeningRow({ name, description, provider }: { name: string; description: string; provider: string }) {
  return (
    <tr>
      <td className="py-3 pr-4 font-medium">{name}</td>
      <td className="py-3 pr-4 text-[var(--color-muted)]">{description}</td>
      <td className="py-3">
        <span className="inline-flex items-center rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-700">
          {provider}
        </span>
      </td>
    </tr>
  )
}

function DocRequirement({ lpType, docs }: { lpType: string; docs: string[] }) {
  return (
    <div className="rounded-lg border border-[var(--color-border)] p-4">
      <h3 className="text-sm font-semibold">{lpType}</h3>
      <ul className="mt-2 space-y-1">
        {docs.map((doc) => (
          <li key={doc} className="flex items-center gap-2 text-sm text-[var(--color-muted)]">
            <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[var(--color-border)]" />
            {doc}
          </li>
        ))}
      </ul>
    </div>
  )
}
