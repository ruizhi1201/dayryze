import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Dayryz — Every Dayryz is a new beginning.',
  description: 'Dayryz is your AI-powered career transformation coach. Find a new career, discover your startup idea, or redesign your life. Start free — no credit card required.',
  keywords: 'career change, career coach, AI career advisor, career transition, find new career, startup ideas, career pivot',
  openGraph: {
    title: 'Dayryz — Every Dayryz is a new beginning.',
    description: 'Stuck in the wrong career? Dayryz helps you find what\'s next. AI-powered coaching available 24/7.',
    url: 'https://dayryz.com',
    siteName: 'Dayryz',
    type: 'website',
    images: [
      {
        url: 'https://dayryz.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Dayryz — AI Career Coach',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dayryz — AI Career Coach',
    description: 'Stuck in the wrong career? Let\'s change that. Start free.',
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://dayryz.com',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} min-h-full flex flex-col antialiased`}>
        {children}
      </body>
    </html>
  )
}
