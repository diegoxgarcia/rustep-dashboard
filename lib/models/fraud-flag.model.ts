import mongoose, { Schema, Document, Model, Types } from 'mongoose'

export interface IFraudFlagDocument extends Document {
  userId: Types.ObjectId
  totalSessions: number
  suspiciousSessions: number
  blockedSessions: number
  avgConfidenceScore: number
  lastSuspiciousAt?: Date
  reviewStatus: string
  reviewedBy?: string
  reviewedAt?: Date
  reviewNotes?: string
  staminaFrozen: boolean
  suspensionEndsAt?: Date
  createdAt: Date
  updatedAt: Date
}

const fraudFlagSchema = new Schema<IFraudFlagDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
    totalSessions: { type: Number, default: 0 },
    suspiciousSessions: { type: Number, default: 0 },
    blockedSessions: { type: Number, default: 0 },
    avgConfidenceScore: { type: Number, default: 1 },
    lastSuspiciousAt: { type: Date, default: null },
    reviewStatus: {
      type: String,
      enum: ['pending', 'under_review', 'cleared', 'confirmed_fraud'],
      default: 'pending',
      index: true,
    },
    reviewedBy: { type: String, default: null },
    reviewedAt: { type: Date, default: null },
    reviewNotes: { type: String, default: null },
    staminaFrozen: { type: Boolean, default: false },
    suspensionEndsAt: { type: Date, default: null },
  },
  { timestamps: true }
)

const FraudFlag: Model<IFraudFlagDocument> =
  mongoose.models.FraudFlag ||
  mongoose.model<IFraudFlagDocument>('FraudFlag', fraudFlagSchema)

export default FraudFlag
