export type plans = 'BASIC'

export type periods = 'DAYLY' | 'WEEKLY' | 'MONTHLY'

export type orderStatus = 'pending' | 'paid' | 'failed' | 'expired'

export type orderTypes = 'order' | 'subscription'

export interface order {
  id: number
  type: orderTypes
  stripe_session_id: string | null
  status: orderStatus
  payload: any
}


export interface orderPayload {
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

