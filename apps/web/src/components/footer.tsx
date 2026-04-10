import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t border-[var(--color-border)] bg-[var(--color-bg-alt)]">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div>
            <p className="text-lg font-bold tracking-tight">Pefko</p>
            <p className="mt-2 text-sm text-[var(--color-muted)]">
              Global deep-tech venture capital.
              <br />
              Pre-seed to Series A.
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-[var(--color-muted)]">
              Navigate
            </p>
            <ul className="mt-3 space-y-2">
              {[
                { href: '/sectors', label: 'Sectors' },
                { href: '/team', label: 'Team' },
                { href: '/blog', label: 'Insights' },
                { href: '/contact', label: 'Contact' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[var(--color-muted)] transition-colors hover:text-[var(--color-primary)]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-[var(--color-muted)]">
              Sectors
            </p>
            <ul className="mt-3 space-y-2">
              {['AI & Machine Learning', 'Space & Aerospace', 'Bio & Medical Tech'].map(
                (sector) => (
                  <li
                    key={sector}
                    className="text-sm text-[var(--color-muted)]"
                  >
                    {sector}
                  </li>
                ),
              )}
            </ul>
          </div>
        </div>
        <div className="mt-10 border-t border-[var(--color-border)] pt-6 text-center text-xs text-[var(--color-muted)]">
          &copy; {new Date().getFullYear()} Pefko. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
