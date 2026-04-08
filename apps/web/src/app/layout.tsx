import type { Metadata } from 'next'
import './globals.css'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'

export const metadata: Metadata = {
  title: {
    default: 'ARCA — Deep-Tech Venture Capital',
    template: '%s | ARCA',
  },
  description:
    'Global venture capital firm investing in transformative deep-tech companies across AI, Space & Aerospace, and Bio & Medical sectors.',
  keywords: [
    'venture capital',
    'deep tech',
    'AI investment',
    'space technology',
    'biotech',
    'medical technology',
  ],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'ARCA',
    title: 'ARCA — Deep-Tech Venture Capital',
    description:
      'Global venture capital investing in AI, Space & Aerospace, and Bio & Medical.',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
