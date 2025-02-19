const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const dbConfig = require('./config');

const initDatabase = async () => {
  let connection;

  try {
    console.log('Attempting to connect to MySQL server...');
    
    // Create connection without database
    connection = await mysql.createConnection({
      host: dbConfig.host,
      user: dbConfig.user,
      password: dbConfig.password,
    });
    
    console.log('Successfully connected to MySQL server');

    // Create database if it doesn't exist
    console.log(`Creating database if not exists: ${dbConfig.database}`);
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${dbConfig.database}`);
    
    // Use the database
    console.log(`Using database: ${dbConfig.database}`);
    await connection.query(`USE ${dbConfig.database}`);

    // Read and execute schema
    console.log('Reading schema file...');
    const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
    const statements = schema.split(';').filter(statement => statement.trim());
    
    console.log('Executing schema statements...');
    for (const statement of statements) {
      if (statement.trim()) {
        await connection.query(statement);
      }
    }

    // Check if super admin exists
    const [admins] = await connection.query('SELECT * FROM admin_users WHERE role = "super_admin"');
    
    // Create default super admin if none exists
    if (!admins.length) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(process.env.SUPER_ADMIN_PASSWORD || 'admin123', salt);
      
      await connection.query(
        'INSERT INTO admin_users (username, email, password, full_name, role) VALUES (?, ?, ?, ?, ?)',
        ['superadmin', 'admin@example.com', hashedPassword, 'Super Admin', 'super_admin']
      );
      
      console.log('Created default super admin account');
    }

    console.log('Database initialization completed successfully');
    return true;
  } catch (error) {
    console.error('Database initialization error:', {
      message: error.message,
      code: error.code,
      errno: error.errno,
      sqlState: error.sqlState,
      sqlMessage: error.sqlMessage
    });
    throw error;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
};

// Run if this file is executed directly
if (require.main === module) {
  initDatabase()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('Failed to initialize database:', error);
      process.exit(1);
    });
}

module.exports = initDatabase;
