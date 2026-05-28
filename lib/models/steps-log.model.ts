import mongoose, { Schema, Document, Model, Types } from 'mongoose'

export interface IStepsLogDocument extends Document {
  userId: Types.ObjectId
  stepsCount: number
  startTime: Date
  endTime: Date
  sessionDurationMinutes: number
  confidenceScore: number
  confidenceStatus: string
  gpsVarianceMeters?: number
  avgSpeedKmh?: number
  staminaCredited?: number
  staminaCreditedAt?: Date
  createdAt: Date
}

const stepsLogSchema = new Schema<IStepsLogDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    stepsCount: { type: Number, required: true, min: 0 },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    sessionDurationMinutes: { type: Number, required: true, min: 0 },
    confidenceScore: { type: Number, required: true, min: 0, max: 1 },
    confidenceStatus: {
      type: String,
      enum: ['valid', 'suspicious', 'blocked'],
      default: 'valid',
    },
    gpsVarianceMeters: { type: Number, default: null },
    avgSpeedKmh: { type: Number, default: null },
    staminaCredited: { type: Number, default: null },
    staminaCreditedAt: { type: Date, default: null },
  },
  { timestamps: true }
)

stepsLogSchema.index({ userId: 1, createdAt: -1 })
stepsLogSchema.index({ startTime: -1 })
stepsLogSchema.index({ confidenceStatus: 1 })

const StepsLog: Model<IStepsLogDocument> =
  mongoose.models.StepsLog || mongoose.model<IStepsLogDocument>('StepsLog', stepsLogSchema)

export default StepsLog
