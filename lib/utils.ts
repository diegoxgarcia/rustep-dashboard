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
    active: 'bg-green-100 text-green-800',
    suspended: 'bg-yellow-100 text-yellow-800',
    banned: 'bg-red-100 text-red-800',
    valid: 'bg-green-100 text-green-800',
    suspicious: 'bg-yellow-100 text-yellow-800',
    blocked: 'bg-red-100 text-red-800',
    pending: 'bg-gray-100 text-gray-800',
    under_review: 'bg-blue-100 text-blue-800',
    cleared: 'bg-green-100 text-green-800',
    confirmed_fraud: 'bg-red-100 text-red-800',
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}

export function getRiskLevel(flag: {
  suspiciousSessions: number
  totalSessions: number
  avgConfidenceScore: number
}): { level: 'high' | 'medium' | 'low'; label: string; color: string } {
  const ratio = flag.totalSessions > 0 ? flag.suspiciousSessions / flag.totalSessions : 0
  if (ratio > 0.5 || flag.avgConfidenceScore < 0.4) {
    return { level: 'high', label: 'Alto', color: 'bg-red-100 text-red-800' }
  }
  if (ratio > 0.2 || flag.avgConfidenceScore < 0.7) {
    return { level: 'medium', label: 'Medio', color: 'bg-yellow-100 text-yellow-800' }
  }
  return { level: 'low', label: 'Bajo', color: 'bg-blue-100 text-blue-800' }
}
