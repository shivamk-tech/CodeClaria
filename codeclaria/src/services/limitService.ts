import connectDb from '@/lib/db'
import Subscription, { PLANS, PlanType } from '@/model/subscription.model'
import Usage from '@/model/usage.model'

function currentMonth() {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
}

export async function getUserPlan(githubId: string): Promise<PlanType> {
  await connectDb()
  const sub = await Subscription.findOne({ githubId })
  if (!sub || !sub.isValid()) return 'free'
  return sub.plan
}

export async function canPostComment(githubId: string): Promise<{ allowed: boolean; reason?: string }> {
  await connectDb()
  const plan = await getUserPlan(githubId)
  const limits = PLANS[plan].limits
  const month = currentMonth()

  const usage = await Usage.findOne({ githubId, month })
  const commentsUsed = usage?.commentsUsed ?? 0

  if (commentsUsed >= limits.commentsPerMonth) {
    return {
      allowed: false,
      reason: `Monthly comment limit reached (${limits.commentsPerMonth}). Upgrade to post more reviews.`,
    }
  }

  return { allowed: true }
}

export async function canConnectRepo(
  githubId: string,
  isPrivate: boolean
): Promise<{ allowed: boolean; reason?: string }> {
  await connectDb()
  const plan = await getUserPlan(githubId)
  const limits = PLANS[plan].limits
  const month = currentMonth()

  const usage = await Usage.findOne({ githubId, month })

  if (isPrivate) {
    const used = usage?.privateReposConnected?.length ?? 0
    if (used >= limits.privateRepos) {
      return {
        allowed: false,
        reason: `Private repo limit reached (${limits.privateRepos}). Upgrade to connect more.`,
      }
    }
  } else {
    const used = usage?.publicReposConnected?.length ?? 0
    if (used >= limits.publicRepos) {
      return {
        allowed: false,
        reason: `Public repo limit reached (${limits.publicRepos}). Upgrade to connect more.`,
      }
    }
  }

  return { allowed: true }
}

export async function incrementCommentCount(githubId: string) {
  await connectDb()
  const month = currentMonth()
  await Usage.findOneAndUpdate(
    { githubId, month },
    { $inc: { commentsUsed: 1 } },
    { upsert: true }
  )
}

export async function trackRepoConnection(githubId: string, repoFullName: string, isPrivate: boolean) {
  await connectDb()
  const month = currentMonth()
  const field = isPrivate ? 'privateReposConnected' : 'publicReposConnected'
  await Usage.findOneAndUpdate(
    { githubId, month },
    { $addToSet: { [field]: repoFullName } },
    { upsert: true }
  )
}
