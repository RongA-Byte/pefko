import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Team',
  description: 'Meet the Pefko team — experienced investors and operators building the future of deep-tech venture capital.',
}

const team = [
  {
    name: 'Solia April',
    role: 'Founding Partner & Managing Director',
    bio: 'Solia April is the founder of Pefko, a global deep-technology venture capital firm investing at the frontier of artificial intelligence, space and aerospace, and biomedical technology. Based in China with a global investment mandate, she leads all investment activities, chairs the Investment Committee, and manages LP relationships across Asia, the Middle East, and Western capital markets.\n\nPefko targets pre-seed to Series A investments in companies developing transformative technologies with high technical risk and asymmetric return potential. The firm deploys a proprietary Technology Readiness Level scoring framework to evaluate deep-tech ventures across its three core sectors, combining rigorous scientific diligence with commercial judgment.\n\nWith experience spanning cross-border venture investing, deep-tech commercialization, and institutional capital formation, April brings the operational rigor and technical credibility required to identify and develop high-conviction investments in globally ambitious founders. She holds particular expertise in Asia-to-global technology transfer and has built extensive networks across the AI infrastructure, space systems, and biomedical innovation ecosystems.\n\nPefko operates an AI-native investment platform from its Singapore management company, enabling institutional-grade portfolio construction, reporting, and LP transparency at a scale typically reserved for larger fund managers.',
  },
]

export default function TeamPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-20">
      <h1 className="text-4xl font-bold tracking-tight">Team</h1>
      <p className="mt-4 text-lg text-[var(--color-muted)]">
        We combine deep technical understanding with global investment experience to support
        founders building transformative companies.
      </p>

      <div className="mt-16 space-y-12">
        {team.map((member) => (
          <div
            key={member.name}
            className="rounded-xl border border-[var(--color-border)] p-8"
          >
            <div className="flex items-start gap-6">
              <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-[var(--color-bg-alt)] text-xl font-bold text-[var(--color-muted)]">
                {member.name
                  .split(' ')
                  .map((w) => w[0])
                  .join('')}
              </div>
              <div>
                <h2 className="text-xl font-semibold">{member.name}</h2>
                <p className="text-sm text-[var(--color-accent)]">{member.role}</p>
                <div className="mt-3 space-y-3 leading-relaxed text-[var(--color-muted)]">
                  {member.bio.split('\n\n').map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-16 rounded-xl bg-[var(--color-bg-alt)] p-8 text-center">
        <h2 className="text-xl font-semibold">We&apos;re growing our team</h2>
        <p className="mt-2 text-[var(--color-muted)]">
          Interested in joining Pefko? We&apos;re looking for exceptional people who share our
          passion for deep technology.
        </p>
      </div>
    </div>
  )
}
