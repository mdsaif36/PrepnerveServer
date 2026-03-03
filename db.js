const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // This is important for Neon/Cloud DBs
  }
});

// Force a test query to verify connection immediately
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('❌ Database Connection Failed! Check your .env file.');
    console.error(err.message);
  } else {
    console.log('✅ Connected to Database Successfully');
  }
});

module.exports = pool;