const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'firstvite_app'
});

const sampleCategories = [
    {
        name: 'Programming',
        description: 'Courses related to programming and software development'
    },
    {
        name: 'Web Development',
        description: 'Courses focused on web technologies and development'
    },
    {
        name: 'Data Science',
        description: 'Courses about data analysis and machine learning'
    },
    {
        name: 'Business',
        description: 'Business and entrepreneurship courses'
    },
    {
        name: 'Design',
        description: 'Graphic design and UI/UX courses'
    },
    {
        name: 'Marketing',
        description: 'Digital marketing and SEO courses'
    },
    {
        name: 'Finance',
        description: 'Financial management and accounting courses'
    },
    {
        name: 'Health & Fitness',
        description: 'Health, wellness, and fitness courses'
    },
    {
        name: 'Music',
        description: 'Music theory and instrument courses'
    },
    {
        name: 'Photography',
        description: 'Photography and videography courses'
    }
];

const addCategories = async () => {
    try {
        const connection = await pool.getConnection();
        
        // Start transaction
        await connection.beginTransaction();
        
        for (const category of sampleCategories) {
            // Insert category
            await connection.query(
                'INSERT IGNORE INTO categories (name, description) VALUES (?, ?)',
                [category.name, category.description]
            );
        }
        
        // Commit transaction
        await connection.commit();
        console.log('Categories added successfully!');
        
    } catch (error) {
        console.error('Error adding categories:', error);
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

addCategories();
