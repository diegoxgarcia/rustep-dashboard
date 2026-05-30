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
      <div className="bg-[#12121E] border border-[#FF5A1F]/40 rounded-lg p-6 space-y-4">
        <h2 className="text-lg font-rajdhani font-semibold text-[#FF5A1F] tracking-wide">Error en el dashboard</h2>
        <div className="bg-[#0A0A12] border border-[#1E1E30] rounded p-3 font-mono text-xs text-[#8BA4BE] overflow-auto max-h-60 whitespace-pre-wrap">
          {error.message || 'Error desconocido'}
        </div>
        {error.stack && (
          <details className="text-xs text-[#8BA4BE] font-exo">
            <summary className="cursor-pointer font-medium text-[#FF5A1F] hover:text-[#E54E16] transition-colors">Stack trace</summary>
            <pre className="mt-2 overflow-auto max-h-40 whitespace-pre-wrap text-[#8BA4BE]">{error.stack}</pre>
          </details>
        )}
        <button
          onClick={reset}
          className="px-4 py-2 bg-[#FF5A1F] text-white rounded-md text-sm hover:bg-[#E54E16] font-exo font-medium transition-colors"
        >
          Reintentar
        </button>
      </div>
    </div>
  )
}
