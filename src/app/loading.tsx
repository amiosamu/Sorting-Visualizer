export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-600 to-purple-800 p-4 flex items-center justify-center">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-white mb-2">Loading Sorting Visualizer</h2>
        <p className="text-white/80">Preparing your sorting algorithms...</p>
      </div>
    </div>
  )
} 