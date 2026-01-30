import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Press_Start_2P } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const pixelFont = Press_Start_2P({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-pixel',
})

export const metadata: Metadata = {
  title: 'Would You Pay? | Validate Before You Build',
  description: 'Stop building things nobody wants. Test your idea in 60 seconds. The first step for every builder.',
  keywords: ['idea validation', 'startup', 'landing page', 'market research', 'MVP', 'builders', 'indie hackers'],
  openGraph: {
    title: 'Would You Pay?',
    description: 'Stop building things nobody wants. Validate before you build.',
    url: 'https://wouldyoupay.io',
    siteName: 'Would You Pay',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Would You Pay?',
    description: 'Stop building things nobody wants. Validate before you build.',
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${pixelFont.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  )
}
