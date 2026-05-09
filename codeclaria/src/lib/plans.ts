export type PlanType = 'free' | 'pro' | 'team'

// Plan limits — controls how much each tier can use per month.
// commentsPerMonth: AI review comments posted to GitHub (PR + commit)
// analysesPerMonth: number of repo analyses via /analyze
// privateRepos / publicRepos: how many repos can have auto-review enabled
export const PLAN_LIMITS = {
  free:  { commentsPerMonth: 30,       analysesPerMonth: 5,        privateRepos: 1,        publicRepos: 1        },
  pro:   { commentsPerMonth: 500,      analysesPerMonth: 50,       privateRepos: Infinity, publicRepos: Infinity },
  team:  { commentsPerMonth: Infinity, analysesPerMonth: Infinity, privateRepos: Infinity, publicRepos: Infinity },
} as const

export const PLANS = {
  free: {
    name: 'Starter',
    price: 0,
    duration: null,
    limits: PLAN_LIMITS.free,
    features: [
      '30 AI comments / month',
      '5 repo analyses / month',
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
    limits: PLAN_LIMITS.pro,
    features: [
      '500 AI comments / month',
      '50 repo analyses / month',
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
    limits: PLAN_LIMITS.team,
    features: [
      'Unlimited AI comments',
      'Unlimited analyses',
      'Unlimited repos',
      'Everything in Pro',
      'Team collaboration',
      'Early access to features',
      'Dedicated support',
    ],
  },
}
