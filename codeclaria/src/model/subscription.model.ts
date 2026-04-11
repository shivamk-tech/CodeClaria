import mongoose, { Schema, Document } from 'mongoose'

export type PlanType = 'free' | 'pro_monthly' | 'pro_yearly'
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
    },
    plan: {
      type: String,
      enum: ['free', 'pro_monthly', 'pro_yearly'],
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
      default: 0, // in rupees
    },
    currency: {
      type: String,
      default: 'INR',
    },
    razorpayOrderId: {
      type: String,
    },
    razorpayPaymentId: {
      type: String,
    },
    razorpaySignature: {
      type: String,
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    endDate: {
      type: Date,
      default: null, // null = free plan (no expiry logic needed)
    },
  },
  {
    timestamps: true,
  }
)

// helper to check if subscription is still valid
SubscriptionSchema.methods.isValid = function (): boolean {
  if (this.status !== 'active') return false
  if (this.plan === 'free') return true
  if (!this.endDate) return false
  return new Date() < this.endDate
}

export const PLANS = {
  free: {
    name: 'Free',
    price: 0,
    duration: null,
    features: [
      '5 repo analyses / month',
      'AI file explanations',
      'Dependency graph',
      'Chat with repo (50 msgs/day)',
    ],
  },
  pro_monthly: {
    name: 'Pro Monthly',
    price: 50,
    duration: 30, // days
    features: [
      'Unlimited repo analyses',
      'AI file explanations',
      'Dependency graph',
      'Unlimited chat',
      'PR & commit auto-review',
      'Priority support',
    ],
  },
  pro_yearly: {
    name: 'Pro Yearly',
    price: 400,
    duration: 365, // days
    features: [
      'Everything in Pro Monthly',
      'Save ₹200 vs monthly',
      'Early access to new features',
      'Priority support',
    ],
  },
}

export default mongoose.models.Subscription ||
  mongoose.model<ISubscription>('Subscription', SubscriptionSchema)
