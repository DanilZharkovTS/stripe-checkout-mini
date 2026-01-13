import pkg from 'pg';
const { Pool } = pkg;
const pool = new Pool({
    password: 'qwerty1234',
    host: 'localhost',
    port: 5432,
    database: 'stripe_checkout_mini_db',
});
export default pool;
