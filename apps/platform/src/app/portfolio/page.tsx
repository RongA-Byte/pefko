import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Portfolio' }

export default function PortfolioPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Portfolio Dashboard</h1>
      <p className="mt-1 text-sm text-[var(--color-muted)]">
        Portfolio company monitoring and performance analytics
      </p>

      <div className="mt-8 rounded-xl border border-dashed border-[var(--color-border)] bg-white p-8 text-center">
        <p className="font-semibold text-[var(--color-muted)]">Coming soon</p>
        <p className="mt-1 text-sm text-[var(--color-muted)]">
          Portfolio dashboard will be available after first investment close.
        </p>
      </div>
    </div>
  )
}
