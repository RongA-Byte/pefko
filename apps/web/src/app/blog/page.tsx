import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Insights',
  description: 'Perspectives from ARCA on deep-tech investing, market trends, and the future of frontier technology.',
}

export default function BlogPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-20">
      <h1 className="text-4xl font-bold tracking-tight">Insights</h1>
      <p className="mt-4 text-lg text-[var(--color-muted)]">
        Our perspectives on deep-tech investing, emerging technologies, and the founders shaping
        the future.
      </p>

      <div className="mt-16 rounded-xl border border-dashed border-[var(--color-border)] p-12 text-center">
        <p className="text-lg font-semibold text-[var(--color-muted)]">Coming soon</p>
        <p className="mt-2 text-sm text-[var(--color-muted)]">
          We&apos;re preparing our first insights. Check back soon for our takes on the
          deep-tech landscape.
        </p>
      </div>
    </div>
  )
}
