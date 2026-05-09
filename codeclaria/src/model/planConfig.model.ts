import mongoose, { Schema, Document } from 'mongoose'

export interface IPlanConfig extends Document {
  plan: 'free' | 'pro' | 'team'
  commentsPerMonth: number
  analysesPerMonth: number
  privateRepos: number
  publicRepos: number
}

const PlanConfigSchema = new Schema<IPlanConfig>({
  plan: { type: String, enum: ['free', 'pro', 'team'], required: true, unique: true },
  commentsPerMonth: { type: Number, required: true },
  analysesPerMonth: { type: Number, required: true },
  privateRepos: { type: Number, required: true },
  publicRepos: { type: Number, required: true },
})

export default mongoose.models.PlanConfig ||
  mongoose.model<IPlanConfig>('PlanConfig', PlanConfigSchema)
