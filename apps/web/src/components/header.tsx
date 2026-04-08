import Link from 'next/link'

const navLinks = [
  { href: '/sectors', label: 'Sectors' },
  { href: '/team', label: 'Team' },
  { href: '/blog', label: 'Insights' },
  { href: '/contact', label: 'Contact' },
]

export function Header() {
  return (
    <header className="border-b border-[var(--color-border)]">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Link href="/" className="text-xl font-bold tracking-tight">
          ARCA
        </Link>
        <ul className="flex items-center gap-8">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-sm font-medium text-[var(--color-muted)] transition-colors hover:text-[var(--color-primary)]"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}
