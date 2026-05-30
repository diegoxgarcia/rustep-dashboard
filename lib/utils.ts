import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Serializa documentos de Mongoose a objetos planos:
 * - ObjectId → string
 * - Date → ISO string
 * Necesario para pasar datos desde Server Components a Client Components.
 */
export function serialize<T>(doc: unknown): T {
  return JSON.parse(JSON.stringify(doc)) as T
}

export function formatDate(date: string | Date): string {
  return format(new Date(date), 'dd MMM yyyy', { locale: es })
}

export function formatDateTime(date: string | Date): string {
  return format(new Date(date), 'dd MMM yyyy HH:mm', { locale: es })
}

export function formatRelative(date: string | Date): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true, locale: es })
}

export function formatNumber(n: number): string {
  return n.toLocaleString('es-AR')
}

export function getWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const dayNum = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7)
}

export function getActivityLabel(category: string): string {
  const labels: Record<string, string> = {
    sedentary: 'Sedentario',
    lightly_active: 'Levemente activo',
    moderately_active: 'Moderadamente activo',
    very_active: 'Muy activo',
    extremely_active: 'Extremadamente activo',
  }
  return labels[category] || category
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    active: 'bg-emerald-900/40 text-emerald-400 border border-emerald-800/50',
    suspended: 'bg-[#FF5A1F]/20 text-[#FF5A1F] border border-[#FF5A1F]/30',
    banned: 'bg-red-900/40 text-red-400 border border-red-800/50',
    valid: 'bg-emerald-900/40 text-emerald-400 border border-emerald-800/50',
    suspicious: 'bg-[#FF5A1F]/20 text-[#FF5A1F] border border-[#FF5A1F]/30',
    blocked: 'bg-red-900/40 text-red-400 border border-red-800/50',
    pending: 'bg-[#1E1E30]/60 text-[#8BA4BE] border border-[#1E1E30]',
    under_review: 'bg-[#00C2FF]/15 text-[#00C2FF] border border-[#00C2FF]/30',
    cleared: 'bg-emerald-900/40 text-emerald-400 border border-emerald-800/50',
    confirmed_fraud: 'bg-red-900/40 text-red-400 border border-red-800/50',
  }
  return colors[status] || 'bg-[#1E1E30]/60 text-[#8BA4BE] border border-[#1E1E30]'
}

export function getRiskLevel(flag: {
  suspiciousSessions: number
  totalSessions: number
  avgConfidenceScore: number
}): { level: 'high' | 'medium' | 'low'; label: string; color: string } {
  const ratio = flag.totalSessions > 0 ? flag.suspiciousSessions / flag.totalSessions : 0
  if (ratio > 0.5 || flag.avgConfidenceScore < 0.4) {
    return { level: 'high', label: 'Alto', color: 'bg-red-900/40 text-red-400 border border-red-800/50' }
  }
  if (ratio > 0.2 || flag.avgConfidenceScore < 0.7) {
    return { level: 'medium', label: 'Medio', color: 'bg-[#FF5A1F]/20 text-[#FF5A1F] border border-[#FF5A1F]/30' }
  }
  return { level: 'low', label: 'Bajo', color: 'bg-[#00C2FF]/15 text-[#00C2FF] border border-[#00C2FF]/30' }
}
