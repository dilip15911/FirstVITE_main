const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'firstvite_app'
});

const migrateCoursesTable = async () => {
    try {
        const connection = await pool.getConnection();
        
        // Add missing columns to courses table
        await connection.query(`
            ALTER TABLE courses 
            ADD COLUMN IF NOT EXISTS price DECIMAL(10,2) DEFAULT 0.00,
            ADD COLUMN IF NOT EXISTS duration VARCHAR(50),
            ADD COLUMN IF NOT EXISTS level ENUM('beginner', 'intermediate', 'advanced') DEFAULT 'beginner',
            ADD COLUMN IF NOT EXISTS image_url VARCHAR(255)
        `);
        
        console.log('Courses table migrated successfully!');
        
    } catch (error) {
        console.error('Error migrating courses table:', error);
        if (connection) {
            connection.release();
        }
    } finally {
        if (connection) {
            connection.release();
        }
    }
};

migrateCoursesTable();
