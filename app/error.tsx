'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center p-4">
      <div className="text-center">
        <div className="text-6xl mb-4">⚠️</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Something went wrong</h2>
        <p className="text-gray-500 mb-8">Don&apos;t worry — try again or go back home.</p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={reset}
            className="bg-orange-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-orange-600 transition"
          >
            Try again
          </button>
          <Link
            href="/"
            className="bg-white text-gray-600 border border-gray-200 px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 transition"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  )
}
