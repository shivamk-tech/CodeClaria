import mongoose, { Schema, Document } from 'mongoose'

export interface IUsage extends Document {
  githubId: string
  month: string
  commentsUsed: number
  analysesUsed: number
  privateReposConnected: string[]
  publicReposConnected: string[]
  createdAt: Date
  updatedAt: Date
}

const UsageSchema = new Schema<IUsage>(
  {
    githubId: { type: String, required: true },
    month: { type: String, required: true },
    commentsUsed: { type: Number, default: 0 },
    analysesUsed: { type: Number, default: 0 },
    privateReposConnected: { type: [String], default: [] },
    publicReposConnected: { type: [String], default: [] },
  },
  { timestamps: true }
)

UsageSchema.index({ githubId: 1, month: 1 }, { unique: true })

export default mongoose.models.Usage ||
  mongoose.model<IUsage>('Usage', UsageSchema)
