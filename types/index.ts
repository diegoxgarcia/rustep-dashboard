export type AccountStatus = 'active' | 'suspended' | 'banned'
export type ActivityCategory =
  | 'sedentary'
  | 'lightly_active'
  | 'moderately_active'
  | 'very_active'
  | 'extremely_active'
export type ConfidenceStatus = 'valid' | 'suspicious' | 'blocked'
export type ReviewStatus = 'pending' | 'under_review' | 'cleared' | 'confirmed_fraud'
export type TransactionType =
  | 'STEPS_CREDIT'
  | 'DAILY_BONUS'
  | 'WEEKLY_BONUS'
  | 'FRIEND_BONUS'
  | 'REWARD_DEBIT'
  | 'ADMIN_ADJUSTMENT'
  | 'REFUND'
export type RankingCategory =
  | 'WEEKLY_STEPS'
  | 'WEEKLY_STAMINA'
  | 'WEEKLY_SESSIONS'
  | 'ALL_TIME_STEPS'

export interface WeeklyStepsHistory {
  weekNumber: number
  year: number
  totalSteps: number
  sessions: number
}

export interface IUser {
  _id: string
  googleId: string
  email: string
  displayName: string
  photoUrl?: string
  age?: number
  gender?: string
  city?: string
  country?: string
  activityCategory: ActivityCategory
  weeklyStepsHistory: WeeklyStepsHistory[]
  accountStatus: AccountStatus
  lastActive: string
  createdAt: string
  updatedAt: string
}

export interface IStepsLog {
  _id: string
  userId: string | IUser
  stepsCount: number
  startTime: string
  endTime: string
  sessionDurationMinutes: number
  confidenceScore: number
  confidenceStatus: ConfidenceStatus
  gpsVarianceMeters?: number
  avgSpeedKmh?: number
  staminaCredited?: number
  staminaCreditedAt?: string
  createdAt: string
}

export interface IFraudFlag {
  _id: string
  userId: string | IUser
  totalSessions: number
  suspiciousSessions: number
  blockedSessions: number
  avgConfidenceScore: number
  lastSuspiciousAt?: string
  reviewStatus: ReviewStatus
  reviewedBy?: string
  reviewedAt?: string
  reviewNotes?: string
  staminaFrozen: boolean
  suspensionEndsAt?: string
  createdAt: string
  updatedAt: string
}

export interface IStaminaLedger {
  id: string
  userId: string
  amount: number
  type: TransactionType
  referenceId?: string
  description?: string
  createdAt: string
}

export interface IRanking {
  id: string
  userId: string
  category: RankingCategory
  score: number
  weekNumber: number
  year: number
  rank?: number
  updatedAt: string
}

export interface OverviewMetrics {
  totalUsers: number
  activeUsersLast7Days: number
  totalStepsToday: number
  totalStaminaCirculation: number
  pendingSuspiciousSessions: number
  stepsLast30Days: { date: string; steps: number }[]
  recentUsers: IUser[]
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}
