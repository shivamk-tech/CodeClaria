import mongoose, { Schema, Document } from 'mongoose'

export interface IUsage extends Document {
  githubId: string
  month: string        // format: "2025-01" — resets every month
  commentsUsed: number
  privateReposConnected: string[]
  publicReposConnected: string[]
  createdAt: Date
  updatedAt: Date
}

const UsageSchema = new Schema<IUsage>(
  {
    githubId: {
      type: String,
      required: true,
    },
    month: {
      type: String,
      required: true, // e.g. "2025-01"
    },
    commentsUsed: {
      type: Number,
      default: 0,
    },
    privateReposConnected: {
      type: [String],
      default: [],
    },
    publicReposConnected: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
)

// one record per user per month
UsageSchema.index({ githubId: 1, month: 1 }, { unique: true })

export default mongoose.models.Usage ||
  mongoose.model<IUsage>('Usage', UsageSchema)
