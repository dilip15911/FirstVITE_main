const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

async function dropTables() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'firstvite_app'
        });

        console.log('Connected to database. Dropping tables...');

        // First disable foreign key checks
        await connection.query('SET FOREIGN_KEY_CHECKS = 0');

        // Drop tables in reverse order of dependencies
        await connection.query('DROP TABLE IF EXISTS course_ratings');
        await connection.query('DROP TABLE IF EXISTS course_enrollments');
        await connection.query('DROP TABLE IF EXISTS course_progress');
        await connection.query('DROP TABLE IF EXISTS course_sections');
        await connection.query('DROP TABLE IF EXISTS course_content');
        await connection.query('DROP TABLE IF EXISTS course_requirements');
        await connection.query('DROP TABLE IF EXISTS course_objectives');
        await connection.query('DROP TABLE IF EXISTS course_prerequisites');
        await connection.query('DROP TABLE IF EXISTS course_tags');
        await connection.query('DROP TABLE IF EXISTS courses');
        await connection.query('DROP TABLE IF EXISTS course_list');
        await connection.query('DROP TABLE IF EXISTS categories');
        await connection.query('DROP TABLE IF EXISTS users');
        await connection.query('DROP TABLE IF EXISTS admin_users');

        // Re-enable foreign key checks
        await connection.query('SET FOREIGN_KEY_CHECKS = 1');

        console.log('All tables dropped successfully!');

    } catch (error) {
        console.error('Error dropping tables:', error);
    }
}

dropTables();
