import mongoose, { Schema, Document } from 'mongoose'

export type PlanType = 'free' | 'pro' | 'team'
export type StatusType = 'active' | 'expired' | 'cancelled'

export interface ISubscription extends Document {
  githubId: string
  plan: PlanType
  status: StatusType
  amount: number
  currency: string
  razorpayOrderId?: string
  razorpayPaymentId?: string
  razorpaySignature?: string
  startDate: Date
  endDate: Date | null
  createdAt: Date
  updatedAt: Date
}

const SubscriptionSchema = new Schema<ISubscription>(
  {
    githubId: {
      type: String,
      required: true,
      unique: true,
    },
    plan: {
      type: String,
      enum: ['free', 'pro', 'team'],
      default: 'free',
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'expired', 'cancelled'],
      default: 'active',
    },
    amount: {
      type: Number,
      default: 0,
    },
    currency: {
      type: String,
      default: 'INR',
    },
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
    razorpaySignature: { type: String },
    startDate: {
      type: Date,
      default: Date.now,
    },
    endDate: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
)

SubscriptionSchema.methods.isValid = function (): boolean {
  if (this.status !== 'active') return false
  if (this.plan === 'free') return true
  if (!this.endDate) return false
  return new Date() < this.endDate
}

export const PLANS = {
  free: {
    name: 'Starter',
    price: 0,
    duration: null,
    limits: {
      commentsPerMonth: 30,
      privateRepos: 1,
      publicRepos: 1,
    },
    features: [
      '30 AI comments / month',
      '1 private repo',
      '1 public repo',
      'PR & commit review',
      'Dependency graph',
    ],
  },
  pro: {
    name: 'Pro',
    price: 299,
    duration: 30,
    badge: 'Intro Offer',
    limits: {
      commentsPerMonth: 500,
      privateRepos: Infinity,
      publicRepos: Infinity,
    },
    features: [
      '500 AI comments / month',
      'Unlimited repos',
      'PR & commit review',
      'Dependency graph',
      'Chat with repo',
      'Priority support',
    ],
  },
  team: {
    name: 'Team',
    price: 999,
    duration: 30,
    limits: {
      commentsPerMonth: Infinity,
      privateRepos: Infinity,
      publicRepos: Infinity,
    },
    features: [
      'Unlimited AI comments',
      'Unlimited repos',
      'Everything in Pro',
      'Team collaboration',
      'Early access to features',
      'Dedicated support',
    ],
  },
}

export default mongoose.models.Subscription ||
  mongoose.model<ISubscription>('Subscription', SubscriptionSchema)
