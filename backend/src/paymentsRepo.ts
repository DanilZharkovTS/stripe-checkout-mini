import pool from './pool'

export const paymentsRepo = {
  addOrder: (productId: number, sessionId: string | null) => {
    return pool.query(
      `INSERT INTO orders (product_id, stripe_session_id)
      VALUES ($1, $2)
      RETURNING *`,
      [productId, sessionId]
    )
  },
  updateOrderSessionId: (sessionId: string, orderId: number) => {
    return pool.query(
      `UPDATE orders
      SET stripe_session_id = $1
      WHERE id = $2
      RETURNING *`,
      sessionId,
      orderId
    )
  },
}
