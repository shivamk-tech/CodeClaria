import mongoose, { Schema, Document } from 'mongoose'

export interface IConnectedRepo extends Document {
  githubId: string
  installationId: number
  accountLogin: string
  accountType: string
  repoSelection: 'all' | 'selected'
  repos: string[]
  createdAt: Date
  updatedAt: Date
}

const ConnectedRepoSchema = new Schema<IConnectedRepo>(
  {
    githubId: {
      type: String,
      required: true,
      unique: true,
    },
    installationId: {
      type: Number,
      required: true,
    },
    accountLogin: {
      type: String,
      required: true,
    },
    accountType: {
      type: String,
      default: 'User',
    },
    repoSelection: {
      type: String,
      enum: ['all', 'selected'],
      default: 'all',
    },
    repos: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
)

export default mongoose.models.ConnectedRepo ||
  mongoose.model<IConnectedRepo>('ConnectedRepo', ConnectedRepoSchema)
