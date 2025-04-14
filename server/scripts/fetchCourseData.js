const axios = require('axios');
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

async function fetchAPIData() {
    try {
        // Fetch from API
        const response = await axios.get('http://localhost:5000/api/courses', {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        });
        console.log('API Response:', JSON.stringify(response.data, null, 2));
        return response.data;
    } catch (error) {
        console.error('Error fetching from API:', error.response?.data || error.message);
        return null;
    }
}

async function fetchDBData() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'firstvite_app'
        });

        const [courses] = await connection.query(`
            SELECT 
                c.*, 
                u.name as instructor_name,
                u.email as instructor_email,
                cat.name as category_name,
                COUNT(e.id) as enrollment_count,
                AVG(r.rating) as average_rating
            FROM courses c
            LEFT JOIN users u ON c.instructor_id = u.id
            LEFT JOIN categories cat ON c.category_id = cat.id
            LEFT JOIN course_enrollments e ON c.id = e.course_id
            LEFT JOIN course_ratings r ON c.id = r.course_id
            GROUP BY c.id
            ORDER BY c.created_at DESC
        `);

        console.log('Database Response:', JSON.stringify(courses, null, 2));
        return courses;
    } catch (error) {
        console.error('Error fetching from database:', error.message);
        return null;
    }
}

async function main() {
    console.log('Fetching data from both API and Database...');
    
    const apiData = await fetchAPIData();
    const dbData = await fetchDBData();

    if (apiData && dbData) {
        console.log('\nComparing data...');
        // Compare the data
        const apiIds = new Set(apiData.data.map(course => course.id));
        const dbIds = new Set(dbData.map(course => course.id));

        console.log('\nAPI only courses:', Array.from(apiIds).filter(id => !dbIds.has(id)));
        console.log('DB only courses:', Array.from(dbIds).filter(id => !apiIds.has(id)));
    }
}

main();
