'use client'

import { useState, type FormEvent } from 'react'

type InquiryType = 'founder' | 'lp' | 'general'

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    // TODO: wire up to API endpoint
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="rounded-xl border border-[var(--color-border)] p-8 text-center">
        <p className="text-lg font-semibold">Thank you for reaching out</p>
        <p className="mt-2 text-sm text-[var(--color-muted)]">
          We&apos;ll review your message and get back to you shortly.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="type" className="block text-sm font-medium">
          I am a...
        </label>
        <select
          id="type"
          name="type"
          required
          defaultValue=""
          className="mt-1 w-full rounded-lg border border-[var(--color-border)] bg-white px-4 py-2.5 text-sm focus:border-[var(--color-accent)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
        >
          <option value="" disabled>
            Select one
          </option>
          <option value={'founder' satisfies InquiryType}>Founder seeking investment</option>
          <option value={'lp' satisfies InquiryType}>Limited partner / investor</option>
          <option value={'general' satisfies InquiryType}>General inquiry</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium">
            First name
          </label>
          <input
            id="firstName"
            name="firstName"
            type="text"
            required
            className="mt-1 w-full rounded-lg border border-[var(--color-border)] px-4 py-2.5 text-sm focus:border-[var(--color-accent)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
          />
        </div>
        <div>
          <label htmlFor="lastName" className="block text-sm font-medium">
            Last name
          </label>
          <input
            id="lastName"
            name="lastName"
            type="text"
            required
            className="mt-1 w-full rounded-lg border border-[var(--color-border)] px-4 py-2.5 text-sm focus:border-[var(--color-accent)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
          />
        </div>
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="mt-1 w-full rounded-lg border border-[var(--color-border)] px-4 py-2.5 text-sm focus:border-[var(--color-accent)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
        />
      </div>

      <div>
        <label htmlFor="company" className="block text-sm font-medium">
          Company / Organization
        </label>
        <input
          id="company"
          name="company"
          type="text"
          className="mt-1 w-full rounded-lg border border-[var(--color-border)] px-4 py-2.5 text-sm focus:border-[var(--color-accent)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          required
          className="mt-1 w-full rounded-lg border border-[var(--color-border)] px-4 py-2.5 text-sm focus:border-[var(--color-accent)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
        />
      </div>

      <button
        type="submit"
        className="w-full rounded-lg bg-[var(--color-primary)] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-gray-800"
      >
        Send message
      </button>
    </form>
  )
}
