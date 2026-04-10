import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sectors',
  description: 'Pefko invests across three core deep-tech verticals: AI, Space & Aerospace, and Bio & Medical Technology.',
}

const sectors = [
  {
    id: 'ai',
    title: 'AI & Machine Learning',
    thesis:
      'Artificial intelligence is the most transformative general-purpose technology since electricity. We invest in companies building foundational AI infrastructure, autonomous systems, and vertical AI applications that create defensible competitive advantages.',
    areas: [
      'Foundation models & model infrastructure',
      'Autonomous systems & robotics',
      'AI-native developer tools',
      'Vertical AI applications (legal, healthcare, finance)',
      'Data infrastructure & MLOps',
      'Computer vision & perception',
    ],
  },
  {
    id: 'space',
    title: 'Space & Aerospace',
    thesis:
      'The space economy is entering a period of rapid commercialization driven by dramatically lower launch costs and advanced manufacturing. We back companies creating critical infrastructure and novel applications for the orbital and beyond-orbital economy.',
    areas: [
      'Small launch vehicles & propulsion',
      'Satellite constellations & communications',
      'Earth observation & geospatial analytics',
      'In-space manufacturing & servicing',
      'Advanced materials & aerophysics',
      'Defense & national security applications',
    ],
  },
  {
    id: 'bio',
    title: 'Bio & Medical Technology',
    thesis:
      'Convergence of computational biology, gene editing, and AI-driven drug discovery is unlocking a new era of precision medicine. We invest in platform companies that fundamentally change how we understand, diagnose, and treat disease.',
    areas: [
      'Synthetic biology & bio-manufacturing',
      'AI-driven drug discovery',
      'Precision medicine & diagnostics',
      'Medical devices & surgical robotics',
      'Genomics & gene therapy platforms',
      'Digital health infrastructure',
    ],
  },
]

export default function SectorsPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-20">
      <h1 className="text-4xl font-bold tracking-tight">Focus Sectors</h1>
      <p className="mt-4 text-lg text-[var(--color-muted)]">
        We invest across three core deep-tech verticals where scientific breakthroughs translate
        into outsized commercial opportunities.
      </p>

      <div className="mt-16 space-y-20">
        {sectors.map((sector) => (
          <section key={sector.id} id={sector.id}>
            <h2 className="text-2xl font-bold">{sector.title}</h2>
            <p className="mt-4 leading-relaxed text-[var(--color-muted)]">{sector.thesis}</p>
            <div className="mt-6">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--color-muted)]">
                Investment areas
              </h3>
              <ul className="mt-3 grid grid-cols-1 gap-2 md:grid-cols-2">
                {sector.areas.map((area) => (
                  <li
                    key={area}
                    className="flex items-start gap-2 text-sm"
                  >
                    <span className="mt-1 block h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[var(--color-accent)]" />
                    {area}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
