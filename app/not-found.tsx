import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center p-4">
      <div className="text-center">
        <div className="text-6xl mb-4">🌅</div>
        <h1 className="text-4xl font-extrabold text-gray-800 mb-2">404</h1>
        <p className="text-gray-500 mb-8">This page doesn&apos;t exist — but your next career chapter does.</p>
        <Link
          href="/"
          className="bg-orange-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-orange-600 transition"
        >
          Back to Dayryze
        </Link>
      </div>
    </div>
  )
}
