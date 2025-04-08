const mysql = require('mysql2/promise');
require('dotenv').config();

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'firstvite_app'
};

// Sample student data
const students = [
  { name: 'Rahul Sharma', email: 'rahul.sharma@example.com', mobile: '9876543210', course: 'Computer Science' },
  { name: 'Priya Patel', email: 'priya.patel@example.com', mobile: '9876543211', course: 'Electrical Engineering' },
  { name: 'Amit Kumar', email: 'amit.kumar@example.com', mobile: '9876543212', course: 'Mechanical Engineering' },
  { name: 'Sneha Gupta', email: 'sneha.gupta@example.com', mobile: '9876543213', course: 'Civil Engineering' },
  { name: 'Vikram Singh', email: 'vikram.singh@example.com', mobile: '9876543214', course: 'Information Technology' },
  { name: 'Neha Verma', email: 'neha.verma@example.com', mobile: '9876543215', course: 'Electronics Engineering' },
  { name: 'Raj Malhotra', email: 'raj.malhotra@example.com', mobile: '9876543216', course: 'Business Administration' },
  { name: 'Ananya Reddy', email: 'ananya.reddy@example.com', mobile: '9876543217', course: 'Data Science' },
  { name: 'Karthik Iyer', email: 'karthik.iyer@example.com', mobile: '9876543218', course: 'Artificial Intelligence' },
  { name: 'Meera Joshi', email: 'meera.joshi@example.com', mobile: '9876543219', course: 'Biotechnology' }
];

async function addStudents() {
  let connection;
  try {
    // Create connection
    connection = await mysql.createConnection(dbConfig);
    console.log('Connected to database successfully');

    // Check if students table exists
    const [tables] = await connection.query('SHOW TABLES LIKE "students"');
    if (tables.length === 0) {
      console.log('Creating students table...');
      await connection.query(`
        CREATE TABLE students (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(100) NOT NULL,
          email VARCHAR(100) NOT NULL UNIQUE,
          mobile VARCHAR(15) NOT NULL,
          course VARCHAR(100) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
      console.log('Students table created successfully');
    }

    // Insert students
    console.log('Adding students to database...');
    for (const student of students) {
      try {
        // Check if email already exists
        const [existing] = await connection.query('SELECT * FROM students WHERE email = ?', [student.email]);
        
        if (existing.length > 0) {
          console.log(`Student with email ${student.email} already exists, skipping...`);
          continue;
        }
        
        // Insert student
        const [result] = await connection.query(
          'INSERT INTO students (name, email, mobile, course) VALUES (?, ?, ?, ?)',
          [student.name, student.email, student.mobile, student.course]
        );
        
        console.log(`Added student: ${student.name} (ID: ${result.insertId})`);
      } catch (err) {
        console.error(`Error adding student ${student.name}:`, err.message);
      }
    }

    console.log('All students added successfully');
  } catch (err) {
    console.error('Database error:', err);
  } finally {
    if (connection) {
      await connection.end();
      console.log('Database connection closed');
    }
  }
}

// Run the function
addStudents();
