import pool from '../pool'

export const paymentsRepo = {
  findProductByID: (id: number) => {
    return pool.query(
      `SELECT * FROM products
      WHERE id = $1`,
      [id]
    )
  },
  addOrder: (productId: number) => {
    return pool.query(
      `INSERT INTO orders (product_id)
      VALUES ($1)
      RETURNING *`,
      [productId]
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
