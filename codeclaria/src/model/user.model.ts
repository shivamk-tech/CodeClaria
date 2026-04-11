import mongoose, { Schema, Document } from 'mongoose'

export interface IUser extends Document {
  githubId: string
  name: string
  email: string
  image: string
  accessToken?: string
  installationId?: number
  createdAt: Date
  updatedAt: Date
  plan: "free" | "pro_monthly" | "pro_yearly"
  planExpiry: Date
}

const UserSchema = new Schema<IUser>(
  {
    githubId: {
      type: String,
      required: true,
      unique: true,
    },

    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
    },

    image: {
      type: String,
      required: true,
    },

    accessToken: {
      type: String,
    },
    installationId: {
      type: Number,
    },
    plan: {
      type: String,
      enum: ["free", "pro_monthly", "pro_yearly"],
      default: "free"
    },
    planExpiry: Date
  },
  {
    timestamps: true,
  }
)

export default mongoose.models.User ||
  mongoose.model<IUser>("User", UserSchema)