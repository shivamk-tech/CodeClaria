import mongoose, { Schema, Document, Types } from 'mongoose'

export interface IConnectRepo {
    userId: Types.ObjectId,
    repoFullName: string,
    name: string,
    description?: string,
    isActive: boolean,
    installationId?: string,
    createdAt: Date
}

const connectRepoSchema = new Schema<IConnectRepo>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    repoFullName: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    isActive: {
        type: Boolean,
        default: true
    },
    installationId: {
        type: String
    }
},
    {
        timestamps: true
    }
)
export default mongoose.models.connectRepo || mongoose.model<IConnectRepo>("connectRepo", connectRepoSchema)