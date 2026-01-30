import Stripe from 'stripe'
import pool from '../../pool.js'
import type {
  orderPayload,
  orderStatus,
  orderTypes,
  periods,
  plans,
} from '../types/paymentsInterfaces.ts'

export const paymentsRepo = {
  getAllProducts: () => {
    return pool.query(`SELECT * FROM products`)
  },
  findProductByID: (id: number) => {
    return pool.query(
      `SELECT * FROM products
      WHERE id = $1`,
      [id]
    )
  },
  addOrder: (
    type: orderTypes,
    payload: orderPayload,
    customerId: string | null | undefined
  ) => {
    return pool.query(
      `INSERT INTO orders (type, payload, stripe_customer_id)
      VALUES ($1, $2, $3)
      RETURNING *`,
      [type, JSON.stringify(payload), customerId]
    )
  },
  updateOrderSessionId: (sessionId: string, orderId: number) => {
    return pool.query(
      `UPDATE orders
      SET stripe_session_id = $1
      WHERE id = $2
      RETURNING *`,
      [sessionId, orderId]
    )
  },
  findOrderById: (orderId: number) => {
    return pool.query(
      `SELECT * FROM orders
      WHERE id = $1`,
      [orderId]
    )
  },
  findOrderBySub: (subId: string | null | undefined) => {
    return pool.query(
      `SELECT * FROM orders
      WHERE payload->>'stripe_subscription_id' = $1`,
      [subId]
    )
  },
  updateOrderStatus: (status: orderStatus, orderId: number) => {
    return pool.query(
      `UPDATE orders 
      SET status = $1
      WHERE id = $2`,
      [status, orderId]
    )
  },
  updateOrderPayload: (
    subId: string | Stripe.Subscription,
    orderId: number
  ) => {
    return pool.query(
      `UPDATE orders
      SET payload = jsonb_set(payload, '{stripe_subscription_id}', to_jsonb($1::text))
      WHERE id = $2
      RETURNING *`,
      [subId, orderId]
    )
  },
  addSubscription: (
    plan: plans,
    period: periods,
    subId: string | null | undefined,
    customerId: string | Stripe.Customer | Stripe.DeletedCustomer | null,
    currentPeriodEnd: number
  ) => {
    return pool.query(
      `INSERT INTO subscriptions (plan, period, stripe_subscription_id, stripe_customer_id, current_period_end)
      VALUES ($1, $2, $3, $4, to_timestamp($5))
      RETURNING *`,
      [plan, period, subId, customerId, currentPeriodEnd]
    )
  },
  findSubBySub: (
    subId: string | null | undefined
  ) => {
    return pool.query(
      `SELECT * FROM subscriptions
      WHERE stripe_subscription_id = $1`,
      [subId]
    )
  },
}
