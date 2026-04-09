import mongoose, {Schema, Document} from 'mongoose'

export interface IUser extends Document {
  githubId: string
  name: string
  email: string
  image: string
  accessToken?: string
  installationId?: number
  createdAt: Date
  updatedAt: Date
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
  },
  {
    timestamps: true,
  }
)

export default mongoose.models.User ||
  mongoose.model<IUser>("User", UserSchema)