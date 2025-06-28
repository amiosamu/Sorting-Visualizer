'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-600 to-purple-800 p-4 flex items-center justify-center">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-center max-w-md">
        <h2 className="text-2xl font-bold text-white mb-4">Something went wrong!</h2>
        <p className="text-white/80 mb-6">
          An error occurred while loading the sorting visualizer. Please try again.
        </p>
        <button
          onClick={reset}
          className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-6 py-3 rounded-lg transition-all duration-300 hover:scale-105"
        >
          Try again
        </button>
      </div>
    </div>
  )
} 