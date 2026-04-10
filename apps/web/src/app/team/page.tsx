import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Team',
  description: 'Meet the Pefko team — experienced investors and operators building the future of deep-tech venture capital.',
}

const team = [
  {
    name: 'Founding Partner',
    role: 'Managing Partner',
    bio: 'Experienced investor and operator with a track record across AI, deep-tech, and frontier technology companies. Led investments from pre-seed through growth stage across global markets.',
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
                <p className="mt-3 leading-relaxed text-[var(--color-muted)]">{member.bio}</p>
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
