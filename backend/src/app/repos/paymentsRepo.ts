import pool from '../../pool.js'
import type { orderItems, orderStatus } from '../types/paymentsInterfaces.ts'

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
  addOrder: (items: orderItems) => {
    return pool.query(
      `INSERT INTO orders (payload)
      VALUES ($1)
      RETURNING *`,
      [JSON.stringify(items)]
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
