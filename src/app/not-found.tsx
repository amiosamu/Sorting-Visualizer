import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-600 to-purple-800 p-4 flex items-center justify-center">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-center max-w-md">
        <h2 className="text-4xl font-bold text-white mb-4">404</h2>
        <h3 className="text-xl font-semibold text-white mb-4">Page Not Found</h3>
        <p className="text-white/80 mb-6">
          The page you&apos;re looking for doesn&apos;t exist. Let&apos;s get you back to the sorting visualizer!
        </p>
        <Link
          href="/"
          className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-medium px-6 py-3 rounded-lg transition-all duration-300 hover:scale-105"
        >
          Go to Sorting Visualizer
        </Link>
      </div>
    </div>
  )
} 