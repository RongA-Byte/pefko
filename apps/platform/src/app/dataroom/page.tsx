import type { Metadata } from 'next'
import Link from 'next/link'
import { DATA_ROOM_FOLDER_LABELS } from '@arca/shared'

export const metadata: Metadata = { title: 'Data Room' }

const folderIcons: Record<string, string> = {
  ppm: 'P',
  lpa: 'L',
  'subscription-agreement': 'S',
  'side-letter': 'SL',
  ddq: 'Q',
  financials: 'F',
  team: 'T',
  legal: 'J',
  other: 'O',
}

export default function DataRoomPage() {
  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">LP Data Room</h1>
          <p className="mt-1 text-sm text-[var(--color-muted)]">
            Secure document portal for fundraising &mdash; powered by DocSend + Carta
          </p>
        </div>
        <div className="flex gap-2">
          <button className="rounded-lg border border-[var(--color-border)] px-4 py-2 text-sm font-medium transition-colors hover:bg-[var(--color-bg-alt)]">
            Manage Access
          </button>
          <button className="rounded-lg bg-[var(--color-accent)] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[var(--color-accent-light)]">
            Upload Document
          </button>
        </div>
      </div>

      {/* Dashboard Stats */}
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Documents" value="0" />
        <StatCard label="LPs with Access" value="0" />
        <StatCard label="Pending NDAs" value="0" accent />
        <StatCard label="Views (30d)" value="0" />
      </div>

      {/* Integration Status */}
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <IntegrationCard
          name="DocSend Advanced"
          description="Data room hosting, NDA gating, watermarking, engagement analytics"
          status="pending"
          cost="~$150/mo"
        />
        <IntegrationCard
          name="Carta Fund Management"
          description="LP portal, capital call/distribution workflows, fund reporting"
          status="pending"
          cost="~$20-30K/yr"
        />
      </div>

      {/* Folder Structure */}
      <div className="mt-8 rounded-xl border border-[var(--color-border)] bg-white p-6">
        <h2 className="font-semibold">Document Structure</h2>
        <p className="mt-1 text-sm text-[var(--color-muted)]">
          Standard VC fund data room folder layout
        </p>
        <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          {Object.entries(DATA_ROOM_FOLDER_LABELS).map(([type, label]) => (
            <FolderCard key={type} icon={folderIcons[type] ?? '?'} name={label} count={0} />
          ))}
        </div>
      </div>

      {/* Access Control */}
      <div className="mt-8 rounded-xl border border-[var(--color-border)] bg-white p-6">
        <h2 className="font-semibold">Access Control</h2>
        <p className="mt-1 text-sm text-[var(--color-muted)]">Per-LP document permissions with NDA gating</p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)]">
                <th className="pb-3 pr-4 font-medium text-[var(--color-muted)]">Feature</th>
                <th className="pb-3 pr-4 font-medium text-[var(--color-muted)]">Description</th>
                <th className="pb-3 font-medium text-[var(--color-muted)]">Provider</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              <FeatureRow
                name="NDA Gating"
                description="Require NDA signature before document access"
                provider="DocSend"
              />
              <FeatureRow
                name="Watermarking"
                description="Dynamic watermarks with LP name/email on viewed documents"
                provider="DocSend"
              />
              <FeatureRow
                name="Per-LP Permissions"
                description="Granular view/download permissions per LP per document"
                provider="DocSend"
              />
              <FeatureRow
                name="Engagement Analytics"
                description="Track page views, time spent, completion rates per LP"
                provider="DocSend"
              />
              <FeatureRow
                name="LP Portal"
                description="Self-service portal for LPs to access documents and reports"
                provider="Carta"
              />
              <FeatureRow
                name="Capital Calls"
                description="Automated capital call generation and LP notification"
                provider="Carta"
              />
              <FeatureRow
                name="Distributions"
                description="Distribution workflow with pro-rata calculations"
                provider="Carta"
              />
            </tbody>
          </table>
        </div>
      </div>

      {/* Engagement Analytics Placeholder */}
      <div className="mt-8 rounded-xl border border-dashed border-[var(--color-border)] bg-white p-8 text-center">
        <p className="font-semibold text-[var(--color-muted)]">No data room activity yet</p>
        <p className="mt-1 text-sm text-[var(--color-muted)]">
          Upload fund documents and grant LP access to begin tracking engagement.
        </p>
      </div>

      {/* Quick Links */}
      <div className="mt-6 flex gap-3">
        <Link
          href="/lps"
          className="rounded-lg border border-[var(--color-border)] px-4 py-2 text-sm font-medium transition-colors hover:bg-[var(--color-bg-alt)]"
        >
          LP Management
        </Link>
        <Link
          href="/compliance"
          className="rounded-lg border border-[var(--color-border)] px-4 py-2 text-sm font-medium transition-colors hover:bg-[var(--color-bg-alt)]"
        >
          AML/KYC Dashboard
        </Link>
      </div>
    </div>
  )
}

function StatCard({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  const valueColor = accent ? 'text-[var(--color-accent)]' : 'text-[var(--color-primary)]'
  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-white p-5">
      <p className="text-xs font-medium uppercase tracking-wider text-[var(--color-muted)]">{label}</p>
      <p className={`mt-2 text-2xl font-bold ${valueColor}`}>{value}</p>
    </div>
  )
}

function IntegrationCard({
  name,
  description,
  status,
  cost,
}: {
  name: string
  description: string
  status: 'pending' | 'connected' | 'error'
  cost: string
}) {
  const statusBadge =
    status === 'connected'
      ? 'bg-green-100 text-green-700'
      : status === 'error'
        ? 'bg-red-100 text-red-700'
        : 'bg-yellow-100 text-yellow-700'
  const statusLabel = status === 'connected' ? 'Connected' : status === 'error' ? 'Error' : 'Setup Pending'

  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-white p-5">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold">{name}</h3>
          <p className="mt-1 text-sm text-[var(--color-muted)]">{description}</p>
        </div>
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusBadge}`}>
          {statusLabel}
        </span>
      </div>
      <p className="mt-3 text-xs text-[var(--color-muted)]">{cost}</p>
    </div>
  )
}

function FolderCard({ icon, name, count }: { icon: string; name: string; count: number }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-[var(--color-border)] p-4 transition-colors hover:bg-[var(--color-bg-alt)]">
      <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--color-bg-alt)] text-xs font-bold text-[var(--color-accent)]">
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{name}</p>
        <p className="text-xs text-[var(--color-muted)]">{count} documents</p>
      </div>
    </div>
  )
}

function FeatureRow({ name, description, provider }: { name: string; description: string; provider: string }) {
  const providerColor =
    provider === 'DocSend' ? 'bg-blue-100 text-blue-700' : 'bg-indigo-100 text-indigo-700'
  return (
    <tr>
      <td className="py-3 pr-4 font-medium">{name}</td>
      <td className="py-3 pr-4 text-[var(--color-muted)]">{description}</td>
      <td className="py-3">
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${providerColor}`}>
          {provider}
        </span>
      </td>
    </tr>
  )
}
