import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'LP Management' }

export default function LpsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">LP Management</h1>
      <p className="mt-1 text-sm text-[var(--color-muted)]">
        Limited partner tracking, onboarding, and compliance
      </p>

      <div className="mt-8 rounded-xl border border-dashed border-[var(--color-border)] bg-white p-8 text-center">
        <p className="font-semibold text-[var(--color-muted)]">Coming soon</p>
        <p className="mt-1 text-sm text-[var(--color-muted)]">
          LP management depends on Data Room and AML/KYC tooling setup.
        </p>
      </div>
    </div>
  )
}
