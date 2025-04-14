const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

async function createCourseListTable() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'firstvite_app'
        });

        console.log('Connected to database. Creating course-list table...');

        // First check if categories and users tables exist
        await connection.query(`
            CREATE TABLE IF NOT EXISTS categories (
                id INT PRIMARY KEY AUTO_INCREMENT,
                name VARCHAR(100) NOT NULL UNIQUE,
                description TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            ) ENGINE=InnoDB
        `);

        await connection.query(`
            CREATE TABLE IF NOT EXISTS users (
                id INT PRIMARY KEY AUTO_INCREMENT,
                name VARCHAR(100) NOT NULL,
                email VARCHAR(100) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                role ENUM('admin', 'instructor', 'student') DEFAULT 'student',
                is_verified BOOLEAN DEFAULT false,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            ) ENGINE=InnoDB
        `);

        // Create course-list table with essential fields
        await connection.query(`
            CREATE TABLE IF NOT EXISTS course_list (
                id INT PRIMARY KEY AUTO_INCREMENT,
                title VARCHAR(255) NOT NULL,
                description TEXT,
                category_id INT,
                instructor_id INT,
                status ENUM('active', 'inactive') DEFAULT 'active',
                price DECIMAL(10,2),
                duration INT,
                level ENUM('beginner', 'intermediate', 'advanced') DEFAULT 'beginner',
                image_url VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (category_id) REFERENCES categories(id),
                FOREIGN KEY (instructor_id) REFERENCES users(id)
            ) ENGINE=InnoDB
        `);

        // Insert default categories
        await connection.query(`
            INSERT IGNORE INTO categories (name, description) VALUES
            ('Programming', 'Courses related to programming and software development'),
            ('Web Development', 'Courses focused on web technologies and development'),
            ('Data Science', 'Courses about data analysis and machine learning'),
            ('Business', 'Business and entrepreneurship courses'),
            ('Design', 'Graphic design and UI/UX courses')
        `);

        console.log('Course-list table and related tables created successfully!');

    } catch (error) {
        console.error('Error creating course-list table:', error);
    }
}

createCourseListTable();
