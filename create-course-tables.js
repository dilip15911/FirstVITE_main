const mysql = require('mysql2/promise');
require('dotenv').config();

// Create connection pool
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '', // Default for XAMPP
    database: 'firstvite_app',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

async function createTables() {
    try {
        console.log('Creating necessary tables...');
        
        // Create courses table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS courses (
                id INT PRIMARY KEY AUTO_INCREMENT,
                title VARCHAR(255) NOT NULL,
                description TEXT,
                duration VARCHAR(50),
                startDate DATETIME DEFAULT CURRENT_TIMESTAMP,
                price DECIMAL(10,2),
                maxStudents INT DEFAULT 100,
                language VARCHAR(50) DEFAULT 'English',
                level VARCHAR(50),
                objectives TEXT,
                learningOutcomes TEXT,
                category_id INT DEFAULT 1,
                instructor_id INT DEFAULT 1,
                thumbnail_url VARCHAR(255),
                curriculum TEXT,
                status VARCHAR(50) DEFAULT 'draft',
                faqs TEXT,
                skills TEXT,
                benefits TEXT,
                courseOverview TEXT,
                keyFeatures TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            );
        `);
        console.log('Courses table created successfully');
        
        // Create course_materials table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS course_materials (
                id INT PRIMARY KEY AUTO_INCREMENT,
                course_id INT,
                material_path VARCHAR(255),
                title VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
            );
        `);
        console.log('Course materials table created successfully');
        
        // Create categories table if it doesn't exist
        await pool.query(`
            CREATE TABLE IF NOT EXISTS categories (
                id INT PRIMARY KEY AUTO_INCREMENT,
                name VARCHAR(100) NOT NULL,
                description TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        
        // Check if categories exist, if not add some default ones
        const [categories] = await pool.query('SELECT COUNT(*) as count FROM categories');
        if (categories[0].count === 0) {
            await pool.query(`
                INSERT INTO categories (name, description) VALUES
                ('Web Development', 'Courses related to web development'),
                ('Mobile Development', 'Courses related to mobile app development'),
                ('Data Science', 'Courses related to data science and analytics'),
                ('Programming', 'General programming courses'),
                ('DevOps', 'Courses related to DevOps and cloud infrastructure');
            `);
            console.log('Default categories added');
        }
        
        console.log('All tables created successfully');
    } catch (error) {
        console.error('Error creating tables:', error);
    } finally {
        process.exit();
    }
}

createTables();
