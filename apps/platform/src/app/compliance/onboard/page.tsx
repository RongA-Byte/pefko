import type { Metadata } from 'next'
import Link from 'next/link'
import { LP_TYPES } from '@arca/shared'

export const metadata: Metadata = { title: 'Onboard New LP' }

const lpTypeLabels: Record<string, string> = {
  'family-office': 'Family Office',
  institutional: 'Institutional',
  'sovereign-wealth': 'Sovereign Wealth Fund',
  strategic: 'Strategic Investor',
  individual: 'Individual / HNW',
}

const documentLabels: Record<string, string> = {
  passport: 'Passport',
  'drivers-license': "Driver's License",
  'national-id': 'National ID',
  'proof-of-address': 'Proof of Address',
  'source-of-funds-declaration': 'Source of Funds Declaration',
  'bank-statement': 'Bank Statement',
  'tax-return': 'Tax Return',
  'corporate-registration': 'Corporate Registration',
  'trust-deed': 'Trust Deed',
  'beneficial-ownership': 'Beneficial Ownership Declaration',
}

export default function OnboardLpPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6">
        <Link
          href="/compliance"
          className="text-sm text-[var(--color-accent)] hover:underline"
        >
          &larr; Back to Compliance
        </Link>
      </div>

      <h1 className="text-2xl font-bold">Onboard New LP</h1>
      <p className="mt-1 text-sm text-[var(--color-muted)]">
        Begin the AML/KYC onboarding process for a new limited partner
      </p>

      {/* Onboarding Steps */}
      <div className="mt-8 space-y-1">
        <StepIndicator step={1} label="LP Information" active />
        <StepIndicator step={2} label="Document Collection" />
        <StepIndicator step={3} label="Screening Initiation" />
        <StepIndicator step={4} label="Compliance Review" />
      </div>

      {/* Step 1: LP Information Form */}
      <div className="mt-8 rounded-xl border border-[var(--color-border)] bg-white p-6">
        <h2 className="font-semibold">LP Information</h2>
        <p className="mt-1 text-sm text-[var(--color-muted)]">
          Collect basic information about the investor
        </p>

        <form className="mt-6 space-y-5">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium" htmlFor="name">
                Full Name / Entity Name
              </label>
              <input
                id="name"
                type="text"
                className="mt-1 w-full rounded-lg border border-[var(--color-border)] px-3 py-2 text-sm outline-none focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)]"
                placeholder="e.g., Horizon Family Office"
              />
            </div>
            <div>
              <label className="block text-sm font-medium" htmlFor="type">
                LP Type
              </label>
              <select
                id="type"
                className="mt-1 w-full rounded-lg border border-[var(--color-border)] px-3 py-2 text-sm outline-none focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)]"
              >
                <option value="">Select type...</option>
                {LP_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {lpTypeLabels[type] ?? type}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium" htmlFor="contactName">
                Contact Person
              </label>
              <input
                id="contactName"
                type="text"
                className="mt-1 w-full rounded-lg border border-[var(--color-border)] px-3 py-2 text-sm outline-none focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)]"
                placeholder="Primary contact name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium" htmlFor="contactEmail">
                Contact Email
              </label>
              <input
                id="contactEmail"
                type="email"
                className="mt-1 w-full rounded-lg border border-[var(--color-border)] px-3 py-2 text-sm outline-none focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)]"
                placeholder="email@example.com"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium" htmlFor="location">
                Location / Jurisdiction
              </label>
              <input
                id="location"
                type="text"
                className="mt-1 w-full rounded-lg border border-[var(--color-border)] px-3 py-2 text-sm outline-none focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)]"
                placeholder="e.g., Singapore"
              />
            </div>
            <div>
              <label className="block text-sm font-medium" htmlFor="commitment">
                Commitment Amount (USD)
              </label>
              <input
                id="commitment"
                type="text"
                className="mt-1 w-full rounded-lg border border-[var(--color-border)] px-3 py-2 text-sm outline-none focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)]"
                placeholder="e.g., 1,000,000"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Link
              href="/compliance"
              className="rounded-lg border border-[var(--color-border)] px-4 py-2 text-sm font-medium transition-colors hover:bg-[var(--color-bg-alt)]"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="rounded-lg bg-[var(--color-accent)] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[var(--color-accent-light)]"
            >
              Continue to Documents
            </button>
          </div>
        </form>
      </div>

      {/* Document Upload Section (Step 2 preview) */}
      <div className="mt-6 rounded-xl border border-dashed border-[var(--color-border)] bg-white p-6">
        <h2 className="font-semibold text-[var(--color-muted)]">Step 2: Document Collection</h2>
        <p className="mt-1 text-sm text-[var(--color-muted)]">
          Required documents depend on LP type. Select an LP type above to see requirements.
        </p>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {['passport', 'proof-of-address', 'source-of-funds-declaration', 'bank-statement'].map((docType) => (
            <div
              key={docType}
              className="flex items-center gap-3 rounded-lg border border-[var(--color-border)] p-3 opacity-50"
            >
              <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md bg-[var(--color-bg-alt)] text-xs">
                DOC
              </span>
              <div>
                <p className="text-sm font-medium">{documentLabels[docType]}</p>
                <p className="text-xs text-[var(--color-muted)]">Not uploaded</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Screening Section (Step 3 preview) */}
      <div className="mt-6 rounded-xl border border-dashed border-[var(--color-border)] bg-white p-6">
        <h2 className="font-semibold text-[var(--color-muted)]">Step 3: AML/KYC Screening</h2>
        <p className="mt-1 text-sm text-[var(--color-muted)]">
          Automated screening via Steward: identity verification, OFAC/PEP check, adverse media, source of funds.
        </p>
        <div className="mt-4 space-y-2">
          {['Identity Verification', 'OFAC Screening', 'PEP Screening', 'Adverse Media', 'Source of Funds'].map(
            (name) => (
              <div
                key={name}
                className="flex items-center justify-between rounded-lg border border-[var(--color-border)] px-4 py-2.5 opacity-50"
              >
                <span className="text-sm">{name}</span>
                <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">
                  Pending
                </span>
              </div>
            ),
          )}
        </div>
      </div>
    </div>
  )
}

function StepIndicator({ step, label, active }: { step: number; label: string; active?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <span
        className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
          active
            ? 'bg-[var(--color-accent)] text-white'
            : 'bg-[var(--color-bg-alt)] text-[var(--color-muted)]'
        }`}
      >
        {step}
      </span>
      <span className={`text-sm ${active ? 'font-medium' : 'text-[var(--color-muted)]'}`}>
        {label}
      </span>
    </div>
  )
}
