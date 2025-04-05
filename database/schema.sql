-- Create database if not exists
CREATE DATABASE IF NOT EXISTS firstvite_app;
USE firstvite_app;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('user', 'instructor', 'admin') DEFAULT 'user',
    isVerified BOOLEAN DEFAULT FALSE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create courses table
CREATE TABLE IF NOT EXISTS courses (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    duration INT NOT NULL COMMENT 'Duration in weeks',
    startDate DATE NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    maxStudents INT NOT NULL,
    enrolledStudents INT DEFAULT 0,
    language VARCHAR(50) NOT NULL,
    level VARCHAR(50) NOT NULL,
    rating DECIMAL(3,2) DEFAULT 0.0,
    objectives TEXT,
    learningOutcomes TEXT,
    status ENUM('draft', 'published', 'archived') DEFAULT 'draft',
    category_id INT,
    instructor_id INT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id),
    FOREIGN KEY (instructor_id) REFERENCES users(id)
);

-- Create course purchases table
CREATE TABLE IF NOT EXISTS course_purchases (
    id INT PRIMARY KEY AUTO_INCREMENT,
    course_id INT NOT NULL,
    user_id INT NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    address TEXT NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    payment_status ENUM('pending', 'completed', 'failed') DEFAULT 'pending',
    comments TEXT,
    amount DECIMAL(10,2) NOT NULL,
    transaction_id VARCHAR(255),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Create course ratings table
CREATE TABLE IF NOT EXISTS course_ratings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    course_id INT NOT NULL,
    user_id INT NOT NULL,
    rating DECIMAL(3,2) NOT NULL,
    review TEXT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses(id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    UNIQUE KEY unique_rating (course_id, user_id)
);

-- Create sample data
-- Insert admin user
INSERT INTO users (name, email, password, role, isVerified) VALUES 
('Admin User', 'admin@example.com', '$2b$10$yourhashedpassword', 'admin', TRUE);

-- Insert categories
INSERT INTO categories (name, description) VALUES 
('Web Development', 'Courses related to web development technologies'),
('Data Science', 'Courses related to data analysis and machine learning'),
('Mobile Development', 'Courses related to mobile app development');

-- Insert sample course
INSERT INTO courses (title, description, duration, startDate, price, maxStudents, 
                    language, level, objectives, learningOutcomes, category_id, instructor_id) 
VALUES 
('Full Stack Web Development', 'Learn full stack web development from scratch', 12, 
 '2024-05-01', 499.99, 30, 'English', 'Beginner', 
 'Learn HTML, CSS, JavaScript\nBuild responsive websites\nMaster React.js\nLearn Node.js and Express',
 'Create web applications\nDeploy applications\nWork with databases\nBuild REST APIs',
 (SELECT id FROM categories WHERE name = 'Web Development'),
 (SELECT id FROM users WHERE email = 'admin@example.com'));

-- Insert sample purchase
INSERT INTO course_purchases (course_id, user_id, full_name, email, phone, 
                            address, payment_method, amount, payment_status) 
VALUES 
((SELECT id FROM courses WHERE title = 'Full Stack Web Development'),
 (SELECT id FROM users WHERE email = 'admin@example.com'),
 'John Doe', 'john@example.com', '1234567890',
 '123 Main St, City, State', 'credit_card', 499.99, 'completed');
