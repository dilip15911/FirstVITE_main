const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'firstvite_app'
});

const migrateUsersTable = async () => {
    try {
        const connection = await pool.getConnection();
        
        // Add role column if it doesn't exist
        await connection.query(`
            ALTER TABLE users 
            ADD COLUMN IF NOT EXISTS role ENUM('admin', 'instructor', 'student') DEFAULT 'student'
        `);
        
        console.log('Users table migrated successfully!');
        
    } catch (error) {
        console.error('Error migrating users table:', error);
        if (connection) {
            connection.release();
        }
    } finally {
        if (connection) {
            connection.release();
        }
    }
};

migrateUsersTable();
