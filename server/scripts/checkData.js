const axios = require('axios');
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

async function checkAPIData() {
    try {
        // Fetch from API
        const apiResponse = await axios.get('http://localhost:5000/api/courses');
        console.log('\nAPI Data:');
        console.log(JSON.stringify(apiResponse.data, null, 2));
        return apiResponse.data;
    } catch (error) {
        console.error('Error fetching from API:', error.response?.data || error.message);
        return null;
    }
}

async function checkDBData() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'firstvite_app'
        });

        // Check all tables
        const tables = ['courses', 'categories', 'users', 'course_enrollments', 'course_ratings'];
        const results = {};

        for (const table of tables) {
            const [rows] = await connection.query(`SELECT * FROM ${table}`);
            results[table] = rows;
            console.log(`\n${table.toUpperCase()} Data:`);
            console.log(JSON.stringify(rows, null, 2));
        }

        return results;
    } catch (error) {
        console.error('Error fetching from database:', error.message);
        return null;
    }
}

async function main() {
    console.log('Checking data from API and Database...');
    
    // Check API data
    console.log('\n=== API Data Check ===');
    await checkAPIData();

    // Check Database data
    console.log('\n=== Database Data Check ===');
    await checkDBData();
}

main();
