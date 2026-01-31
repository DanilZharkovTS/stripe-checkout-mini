import pkg from 'pg'
const { Pool } = pkg

const pool = new Pool({
  database: 'stripe_checkout_mini_db',
  user: 'postgres',
  password: 'qwerty1234',
  port: 5432,
  // connectionString: process.env.DATABASE_URL,
  // ssl: { rejectUnauthorized: true }
})

export default pool
