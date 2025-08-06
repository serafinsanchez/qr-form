import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Elysian Circle - Your Journey to Radiance Continues',
  description: 'Thank you for welcoming us into your ritual. Share your experience and unlock an exclusive gift for your next purchase.',
  keywords: 'Elysian Fields, Radiant C Serum, skincare, feedback, loyalty program',
  openGraph: {
    title: 'Elysian Circle - Your Journey to Radiance Continues',
    description: 'Thank you for welcoming us into your ritual. Share your experience and unlock an exclusive gift for your next purchase.',
    type: 'website',
    url: 'https://qr-form.vercel.app',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
} 