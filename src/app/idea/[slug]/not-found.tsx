import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white flex items-center justify-center">
      <div className="text-center px-6">
        <span className="text-6xl mb-6 block">🤔</span>
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          Idea Not Found
        </h1>
        <p className="text-gray-400 mb-8 max-w-md mx-auto">
          This idea doesn&apos;t exist yet. Maybe you should create it?
        </p>
        <Link
          href="https://wouldyoupay.io"
          className="inline-block px-6 py-3 bg-blue-500 hover:bg-blue-400 rounded-lg font-semibold transition-colors"
        >
          Go to Would You Pay
        </Link>
      </div>
    </div>
  )
}
