'use client'

import { useEffect } from 'react'

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Dashboard error:', error)
  }, [error])

  return (
    <div className="p-8 max-w-2xl">
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 space-y-4">
        <h2 className="text-lg font-semibold text-red-800">Error en el dashboard</h2>
        <div className="bg-red-100 rounded p-3 font-mono text-xs text-red-900 overflow-auto max-h-60 whitespace-pre-wrap">
          {error.message || 'Error desconocido'}
        </div>
        {error.stack && (
          <details className="text-xs text-red-700">
            <summary className="cursor-pointer font-medium">Stack trace</summary>
            <pre className="mt-2 overflow-auto max-h-40 whitespace-pre-wrap">{error.stack}</pre>
          </details>
        )}
        <button
          onClick={reset}
          className="px-4 py-2 bg-red-600 text-white rounded-md text-sm hover:bg-red-700"
        >
          Reintentar
        </button>
      </div>
    </div>
  )
}
