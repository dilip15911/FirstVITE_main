const mysql = require('mysql2/promise');
const config = require('./config');

const pool = mysql.createPool(config);  // ✅ Correct way

(async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Database connected successfully');
    connection.release();
  } catch (err) {
    console.error('❌ Database connection failed:', err);
  }
})();

// Test the connection
pool.getConnection()
  .then(connection => {
    console.log('Database connection pool initialized');
    connection.release();
  })
  .catch(error => {
    console.error('Error initializing database pool:', error);
  });

module.exports = pool;  // ✅ Export only once
