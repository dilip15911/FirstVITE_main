const mysql = require('mysql2/promise');
const config = require('./config');

const pool = mysql.createPool(config);

// Test the connection
pool.getConnection()
  .then(connection => {
    console.log('Database connection pool initialized');
    connection.release();
  })
  .catch(error => {
    console.error('Error initializing database pool:', error);
  });

module.exports = pool;
