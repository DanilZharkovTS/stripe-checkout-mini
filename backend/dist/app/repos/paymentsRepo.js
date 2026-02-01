import pool from '../../pool.js';
export const paymentsRepo = {
    getAllProducts: () => {
        return pool.query(`SELECT * FROM products`);
    },
    findProductByID: (id) => {
        return pool.query(`SELECT * FROM products
      WHERE id = $1`, [id]);
    },
    addOrder: (productId) => {
        return pool.query(`INSERT INTO orders (product_id)
      VALUES ($1)
      RETURNING *`, [productId]);
    },
    updateOrderSessionId: (sessionId, orderId) => {
        return pool.query(`UPDATE orders
      SET stripe_session_id = $1
      WHERE id = $2
      RETURNING *`, [sessionId, orderId]);
    },
    findOrderById: (orderId) => {
        return pool.query(`SELECT * FROM orders
      WHERE id = $1`, [orderId]);
    },
    updateOrderStatus: (status, orderId) => {
        return pool.query(`UPDATE orders 
      SET status = $1
      WHERE id = $2`, [status, orderId]);
    },
};
