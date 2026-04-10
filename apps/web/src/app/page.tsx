import Link from 'next/link'

const sectors = [
  {
    title: 'AI & Machine Learning',
    description:
      'Foundation models, autonomous systems, AI infrastructure, and applied intelligence across verticals.',
    href: '/sectors#ai',
  },
  {
    title: 'Space & Aerospace',
    description:
      'Launch systems, satellite constellations, Earth observation, in-space manufacturing, and defense tech.',
    href: '/sectors#space',
  },
  {
    title: 'Bio & Medical Tech',
    description:
      'Synthetic biology, precision medicine, medical devices, drug discovery platforms, and health AI.',
    href: '/sectors#bio',
  },
]

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="mx-auto max-w-4xl px-6 py-24 text-center">
        <h1 className="text-5xl font-bold leading-tight tracking-tight md:text-6xl">
          Investing at the frontier
          <br />
          of deep technology
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-[var(--color-muted)]">
          Pefko is a global venture capital firm backing exceptional founders building
          transformative companies in AI, space, and life sciences. Pre-seed to Series&nbsp;A.
        </p>
        <div className="mt-10 flex items-center justify-center gap-4">
          <Link
            href="/contact"
            className="rounded-lg bg-[var(--color-primary)] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-gray-800"
          >
            Get in touch
          </Link>
          <Link
            href="/sectors"
            className="rounded-lg border border-[var(--color-border)] px-6 py-3 text-sm font-medium transition-colors hover:bg-[var(--color-bg-alt)]"
          >
            Our sectors
          </Link>
        </div>
      </section>

      {/* Thesis */}
      <section className="border-t border-[var(--color-border)] bg-[var(--color-bg-alt)]">
        <div className="mx-auto max-w-4xl px-6 py-20">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--color-muted)]">
            Investment thesis
          </h2>
          <p className="mt-4 text-2xl font-semibold leading-relaxed">
            We believe the next generation of outsized returns will come from companies solving
            hard scientific and engineering problems. We partner with technical founders who
            combine deep domain expertise with a global ambition to create category-defining
            businesses.
          </p>
        </div>
      </section>

      {/* Sectors */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--color-muted)]">
          Focus sectors
        </h2>
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
          {sectors.map((sector) => (
            <Link
              key={sector.title}
              href={sector.href}
              className="group rounded-xl border border-[var(--color-border)] p-8 transition-all hover:border-[var(--color-accent)] hover:shadow-sm"
            >
              <h3 className="text-lg font-semibold group-hover:text-[var(--color-accent)]">
                {sector.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-[var(--color-muted)]">
                {sector.description}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-[var(--color-border)] bg-[var(--color-bg-alt)]">
        <div className="mx-auto max-w-4xl px-6 py-20 text-center">
          <h2 className="text-3xl font-bold">Building something ambitious?</h2>
          <p className="mt-4 text-[var(--color-muted)]">
            We&apos;re always looking to meet exceptional founders working on hard problems.
          </p>
          <Link
            href="/contact"
            className="mt-8 inline-block rounded-lg bg-[var(--color-accent)] px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-[var(--color-accent-light)]"
          >
            Reach out
          </Link>
        </div>
      </section>
    </>
  )
}
