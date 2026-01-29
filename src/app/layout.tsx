import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'Would You Pay? | Validate Ideas Before You Build',
  description: 'Stop building things nobody wants. Test demand with landing pages and real signups before writing a line of code.',
  keywords: ['idea validation', 'startup', 'landing page', 'market research', 'MVP'],
  openGraph: {
    title: 'Would You Pay?',
    description: 'Stop building things nobody wants. Test demand before you code.',
    url: 'https://wouldyoupay.io',
    siteName: 'Would You Pay',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Would You Pay?',
    description: 'Stop building things nobody wants. Test demand before you code.',
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  )
}
