import type { Metadata } from 'next'
import { ContactForm } from '@/components/contact-form'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with Pefko. We want to hear from founders building transformative deep-tech companies.',
}

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-20">
      <h1 className="text-4xl font-bold tracking-tight">Contact us</h1>
      <p className="mt-4 text-lg text-[var(--color-muted)]">
        Whether you&apos;re a founder raising capital, an LP interested in our fund, or someone
        who wants to collaborate — we&apos;d love to hear from you.
      </p>

      <div className="mt-12 grid grid-cols-1 gap-12 md:grid-cols-2">
        <div>
          <ContactForm />
        </div>
        <div className="space-y-8">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--color-muted)]">
              For founders
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[var(--color-muted)]">
              We invest pre-seed through Series A in AI, space, and biotech. If you&apos;re
              building something transformative, tell us about your company.
            </p>
          </div>
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--color-muted)]">
              For limited partners
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[var(--color-muted)]">
              Interested in our fund? We welcome conversations with institutional investors,
              family offices, and strategic partners.
            </p>
          </div>
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--color-muted)]">
              General inquiries
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[var(--color-muted)]">
              For press, partnerships, or other inquiries, please use the form and we&apos;ll
              route your message to the right person.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
