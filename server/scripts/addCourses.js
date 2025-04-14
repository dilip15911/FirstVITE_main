const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'firstvite_app'
});

// Get instructor IDs
const getInstructorIds = async () => {
    const [rows] = await pool.query('SELECT id FROM users WHERE role = "instructor"');
    return rows.map(row => row.id);
};

// Get category IDs
const getCategoryIds = async () => {
    const [rows] = await pool.query('SELECT id FROM categories');
    return rows.map(row => row.id);
};

const sampleCourses = [
    {
        title: 'Complete Python Bootcamp',
        description: 'Learn Python programming from scratch to advanced level',
        category_id: 1, // Programming
        instructor_id: 1, // John Smith
        status: 'published',
        price: 199.99,
        duration: '12 weeks',
        level: 'beginner',
        image_url: 'https://example.com/python-course.jpg'
    },
    {
        title: 'Modern Web Development',
        description: 'Build responsive websites using HTML, CSS, and JavaScript',
        category_id: 2, // Web Development
        instructor_id: 2, // Sarah Johnson
        status: 'published',
        price: 149.99,
        duration: '8 weeks',
        level: 'beginner',
        image_url: 'https://example.com/web-dev-course.jpg'
    },
    {
        title: 'Data Science Fundamentals',
        description: 'Introduction to data analysis and machine learning',
        category_id: 3, // Data Science
        instructor_id: 3, // Michael Brown
        status: 'draft',
        price: 249.99,
        duration: '10 weeks',
        level: 'intermediate',
        image_url: 'https://example.com/data-science-course.jpg'
    },
    {
        title: 'Business Analytics',
        description: 'Learn business intelligence and data analysis',
        category_id: 4, // Business
        instructor_id: 4, // Emily Wilson
        status: 'published',
        price: 179.99,
        duration: '6 weeks',
        level: 'intermediate',
        image_url: 'https://example.com/business-course.jpg'
    }
];

const addCourses = async () => {
    try {
        const connection = await pool.getConnection();
        
        // Get instructor and category IDs
        const [instructorIds, categoryIds] = await Promise.all([
            getInstructorIds(),
            getCategoryIds()
        ]);

        if (instructorIds.length === 0) {
            console.error('No instructors found in the database. Please add instructors first.');
            return;
        }

        if (categoryIds.length === 0) {
            console.error('No categories found in the database. Please add categories first.');
            return;
        }

        // Start transaction
        await connection.beginTransaction();
        
        for (const course of sampleCourses) {
            // Insert course
            await connection.query(
                'INSERT IGNORE INTO courses (title, description, category_id, instructor_id, status, price, duration, level, image_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
                [
                    course.title,
                    course.description,
                    course.category_id,
                    course.instructor_id,
                    course.status,
                    course.price,
                    course.duration,
                    course.level,
                    course.image_url
                ]
            );
        }
        
        // Commit transaction
        await connection.commit();
        console.log('Courses added successfully!');
        
    } catch (error) {
        console.error('Error adding courses:', error);
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

addCourses();
