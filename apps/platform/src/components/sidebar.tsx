import Link from 'next/link'

const navItems = [
  { href: '/', label: 'Dashboard', icon: 'H' },
  { href: '/deals', label: 'Deal Pipeline', icon: 'D' },
  { href: '/trl', label: 'TRL Scoring', icon: 'T' },
  { href: '/memos', label: 'IC Memos', icon: 'M' },
  { href: '/lps', label: 'LP Management', icon: 'L' },
  { href: '/dataroom', label: 'Data Room', icon: 'R' },
  { href: '/compliance', label: 'AML/KYC', icon: 'C' },
  { href: '/portfolio', label: 'Portfolio', icon: 'P' },
  { href: '/reporting', label: 'LP Reports', icon: 'Q' },
]

export function Sidebar() {
  return (
    <aside className="flex w-60 flex-col border-r border-[var(--color-border)] bg-white">
      <div className="px-5 py-6">
        <Link href="/" className="text-lg font-bold tracking-tight">
          ARCA
        </Link>
        <p className="mt-0.5 text-xs text-[var(--color-muted)]">Fund Platform</p>
      </div>
      <nav className="flex-1 px-3">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-[var(--color-muted)] transition-colors hover:bg-[var(--color-bg-alt)] hover:text-[var(--color-primary)]"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-[var(--color-bg-alt)] text-xs font-bold">
                  {item.icon}
                </span>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}
