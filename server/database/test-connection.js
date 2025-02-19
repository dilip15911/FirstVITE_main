const pool = require('./db');

async function testConnection() {
    try {
        // Test the connection
        const connection = await pool.getConnection();
        console.log('Successfully connected to the database!');

        // Test query
        const [rows] = await connection.query('SELECT NOW() as time');
        console.log('Current database time:', rows[0].time);

        // Release the connection
        connection.release();
        console.log('Database connection test completed successfully!');
    } catch (error) {
        console.error('Database connection failed:', error);
    } finally {
        // Close the pool
        await pool.end();
    }
}

testConnection();
