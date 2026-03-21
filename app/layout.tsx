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
  title: 'Dayryze — AI Career Coach for Career Changers',
  description: 'Dayryze is your AI-powered career transformation coach. Find a new career, discover your startup idea, or redesign your life. Start free — no credit card required.',
  keywords: 'career change, career coach, AI career advisor, career transition, find new career, startup ideas, career pivot',
  openGraph: {
    title: 'Dayryze — AI Career Coach for Career Changers',
    description: 'Stuck in the wrong career? Dayryze helps you find what\'s next. AI-powered coaching available 24/7.',
    url: 'https://dayryze.com',
    siteName: 'Dayryze',
    type: 'website',
    images: [
      {
        url: 'https://dayryze.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Dayryze — AI Career Coach',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dayryze — AI Career Coach',
    description: 'Stuck in the wrong career? Let\'s change that. Start free.',
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://dayryze.com',
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
