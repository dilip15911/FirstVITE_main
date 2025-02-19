require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '', // XAMPP default has no password
  database: process.env.DB_NAME || 'webfirstvitemain',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
  multipleStatements: true, // Enable multiple statements for initialization
  timezone: 'Z', // Use UTC timezone
  charset: 'utf8mb4' // Support full Unicode character set
};

// Log database configuration (without sensitive info)
console.log('Database Config:', {
  host: dbConfig.host,
  user: dbConfig.user,
  database: dbConfig.database,
  hasPassword: !!dbConfig.password,
  connectionLimit: dbConfig.connectionLimit
});

module.exports = dbConfig;
