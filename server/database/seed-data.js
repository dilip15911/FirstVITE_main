const pool = require('./db');
const bcrypt = require('bcryptjs');

async function seedData() {
    try {
        const connection = await pool.getConnection();

        // Sample Users
        const hashedPassword = await bcrypt.hash('user123', 10);
        await connection.query(`
            INSERT INTO users (name, email, password, email_verified) VALUES
            ('John Doe', 'john@example.com', ?, true),
            ('Jane Smith', 'jane@example.com', ?, true)
        `, [hashedPassword, hashedPassword]);
        console.log('Sample users created');

        // Sample Products
        await connection.query(`
            INSERT INTO products (name, description, price, stock) VALUES
            ('Web Development Course', 'Complete web development bootcamp', 99.99, 100),
            ('Mobile App Course', 'Learn mobile app development', 89.99, 100),
            ('UI/UX Design Course', 'Master UI/UX design principles', 79.99, 100),
            ('Python Programming', 'Learn Python from scratch', 69.99, 100)
        `);
        console.log('Sample products created');

        // Sample Orders
        const [users] = await connection.query('SELECT id FROM users LIMIT 2');
        const [products] = await connection.query('SELECT id, price FROM products LIMIT 2');

        // Create order for first user
        await connection.query(`
            INSERT INTO orders (user_id, total_amount, status) VALUES
            (?, ?, 'completed')
        `, [users[0].id, products[0].price + products[1].price]);

        const [order] = await connection.query('SELECT LAST_INSERT_ID() as id');
        
        // Add order items
        await connection.query(`
            INSERT INTO order_items (order_id, product_id, quantity, price) VALUES
            (?, ?, 1, ?),
            (?, ?, 1, ?)
        `, [
            order[0].id, products[0].id, products[0].price,
            order[0].id, products[1].id, products[1].price
        ]);
        console.log('Sample orders created');

        // Sample Contact Messages
        await connection.query(`
            INSERT INTO contact_messages (name, email, subject, message, status) VALUES
            ('Alice Brown', 'alice@example.com', 'Course Inquiry', 'I would like to know more about the web development course.', 'unread'),
            ('Bob Wilson', 'bob@example.com', 'Technical Support', 'Having trouble accessing the course materials.', 'read')
        `);
        console.log('Sample contact messages created');

        connection.release();
        console.log('Sample data seeding completed successfully!');
    } catch (error) {
        console.error('Error seeding data:', error);
    } finally {
        await pool.end();
    }
}

seedData();
