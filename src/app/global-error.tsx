'use client'

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body>
        <div className="min-h-screen bg-gradient-to-br from-red-500 via-purple-600 to-purple-800 p-4 flex items-center justify-center">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-center max-w-md">
            <h2 className="text-2xl font-bold text-white mb-4">Application Error</h2>
            <p className="text-white/80 mb-6">
              A critical error occurred in the sorting visualizer application.
            </p>
            <button
              onClick={reset}
              className="bg-red-500 hover:bg-red-600 text-white font-medium px-6 py-3 rounded-lg transition-all duration-300 hover:scale-105"
            >
              Reset Application
            </button>
          </div>
        </div>
      </body>
    </html>
  )
} 