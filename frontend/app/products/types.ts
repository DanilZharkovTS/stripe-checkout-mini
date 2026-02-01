export interface product {
  id: number
  name: string
  description: string
  price: string
  currency: string
  image_url: string
}

export type subscriptionPlans = 'BASIC'

export type subscriptionPeriods = 'DAYLY' | 'WEEKLY' | 'MONTHLY'

export interface subscription {
  plan: subscriptionPlans
  period: subscriptionPeriods
}

export type subscriptionVariants = subscription[]
