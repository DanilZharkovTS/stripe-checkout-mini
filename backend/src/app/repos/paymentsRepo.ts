import pool from '../../pool.js'
import type { orderStatus } from '../types/paymentsInterfaces.ts'

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
  updateOrderStatus: (status: orderStatus, orderId: number) => {
    return pool.query(
      `UPDATE orders 
      SET status = $1
      WHERE id = $2`,
      [status, orderId]
    )
  },
}
