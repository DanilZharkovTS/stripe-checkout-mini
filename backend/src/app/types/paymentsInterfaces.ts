export type orderStatus = 'pending' | 'paid' | 'failed' | 'expired'

export interface orderItems {
  product_id?: number
  subscription_plan?: 'BASIC'
  subscription_period?: 'DAYLY' | 'WEEKLY' | 'MONTHLY'
}

export interface SubscriptionSessionDTO {
  plan: 'BASIC'
  period: 'DAYLY' | 'WEEKLY' | 'MONTHLY'
}

export interface plan {
  DAYLY: { priceId: string }
  WEEKLY: { priceId: string }
  MONTHLY: { priceId: string }
}

export type plans = 'BASIC'

export type periods = 'DAYLY' | 'WEEKLY' | 'MONTHLY'
