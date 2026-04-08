import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ARCA Platform',
  description: 'Internal fund management platform',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
