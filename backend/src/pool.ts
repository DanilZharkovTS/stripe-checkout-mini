import pkg from 'pg-pool'
const { Pool } = pkg

const pool = new Pool({
  user: 'postgres',
  password: 'qwerty1234',
  host: 'localhost',
  port: 5432,
  database: 'stripe_checkout_mini_db',
})

export default pool
