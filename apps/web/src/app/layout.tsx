import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ARCA — Deep-Tech Venture Capital',
  description:
    'Global venture capital firm investing in transformative deep-tech companies across AI, Space & Aerospace, and Bio & Medical sectors.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
