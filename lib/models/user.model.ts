import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IUserDocument extends Document {
  googleId: string
  email: string
  displayName: string
  photoUrl?: string
  age?: number
  gender?: string
  city?: string
  country?: string
  activityCategory: string
  weeklyStepsHistory: {
    weekNumber: number
    year: number
    totalSteps: number
    sessions: number
  }[]
  accountStatus: string
  lastActive: Date
  createdAt: Date
  updatedAt: Date
}

const weeklyStepsSchema = new Schema(
  {
    weekNumber: { type: Number, required: true },
    year: { type: Number, required: true },
    totalSteps: { type: Number, default: 0 },
    sessions: { type: Number, default: 0 },
  },
  { _id: false }
)

const userSchema = new Schema<IUserDocument>(
  {
    googleId: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    displayName: { type: String, required: true, trim: true },
    photoUrl: { type: String, default: null },
    age: { type: Number, min: 13, max: 120, default: null },
    gender: {
      type: String,
      enum: ['male', 'female', 'other', 'prefer_not_to_say'],
      default: null,
    },
    city: { type: String, trim: true, default: null },
    country: { type: String, trim: true, default: null },
    activityCategory: {
      type: String,
      enum: ['sedentary', 'lightly_active', 'moderately_active', 'very_active', 'extremely_active'],
      default: 'sedentary',
    },
    weeklyStepsHistory: [weeklyStepsSchema],
    lastActive: { type: Date, default: Date.now },
    accountStatus: {
      type: String,
      enum: ['active', 'suspended', 'banned'],
      default: 'active',
    },
  },
  { timestamps: true }
)

userSchema.index({ createdAt: -1 })
userSchema.index({ accountStatus: 1 })
userSchema.index({ lastActive: -1 })

const User: Model<IUserDocument> =
  mongoose.models.User || mongoose.model<IUserDocument>('User', userSchema)

export default User
