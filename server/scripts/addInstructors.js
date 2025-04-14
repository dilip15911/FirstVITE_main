const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

// Database configuration
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'firstvite_app'
};

const pool = mysql.createPool(dbConfig);

// Sample instructor data
const sampleInstructors = [
    {
        name: 'John Smith',
        email: 'john.smith@example.com',
        password: 'instructor123',
        role: 'instructor'
    },
    {
        name: 'Sarah Johnson',
        email: 'sarah.johnson@example.com',
        password: 'instructor123',
        role: 'instructor'
    },
    {
        name: 'Michael Brown',
        email: 'michael.brown@example.com',
        password: 'instructor123',
        role: 'instructor'
    },
    {
        name: 'Emily Wilson',
        email: 'emily.wilson@example.com',
        password: 'instructor123',
        role: 'instructor'
    }
];

const addInstructors = async () => {
    try {
        const connection = await pool.getConnection();
        
        // Start transaction
        await connection.beginTransaction();
        
        for (const instructor of sampleInstructors) {
            // Hash password
            const hashedPassword = await bcrypt.hash(instructor.password, 10);
            
            // Insert instructor
            await connection.query(
                'INSERT IGNORE INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
                [instructor.name, instructor.email, hashedPassword, instructor.role]
            );
        }
        
        // Commit transaction
        await connection.commit();
        console.log('Instructors added successfully!');
        
    } catch (error) {
        console.error('Error adding instructors:', error);
        // Rollback transaction on error
        if (connection) {
            await connection.rollback();
        }
    } finally {
        if (connection) {
            connection.release();
        }
    }
};

addInstructors();
