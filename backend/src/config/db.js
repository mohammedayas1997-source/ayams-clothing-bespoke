const { Pool } = require('pg');
require('dotenv').config();

// Saita hanyar sadarwa da PostgreSQL ta hanyar Environment Variables
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'ayams_bespoke_db',
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
  max: 20, // Matsakaicin yawan connections a lokaci guda
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Gwajin haɗin database lokacin kunna manhaja
pool.on('connect', () => {
  console.log('✅ PostgreSQL Database ta hadu cikin nasara!');
});

pool.on('error', (err) => {
  console.error('❌ Kuskure a hadin PostgreSQL:', err.message);
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
};