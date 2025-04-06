-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS firstvite_app;
USE firstvite_app;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
    id INT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create courses table
CREATE TABLE IF NOT EXISTS courses (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category_id INT NOT NULL,
    status ENUM('draft', 'published', 'archived') DEFAULT 'draft',
    instructor_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
    FOREIGN KEY (instructor_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Create admin user if it doesn't exist
INSERT INTO admin_users (id, username, password, created_at)
SELECT 1, 'admin', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NOW()
WHERE NOT EXISTS (SELECT 1 FROM admin_users WHERE id = 1);

-- Insert default categories if they don't exist
INSERT INTO categories (id, name, slug, description)
SELECT 1, 'Web Development', 'web-development', 'Courses related to web development and programming'
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE id = 1);

-- Insert default user if it doesn't exist
INSERT INTO users (id, name, email, password)
SELECT 1, 'Admin User', 'admin@example.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE id = 1);

-- Create a stored procedure to create a course
DELIMITER //
CREATE PROCEDURE create_course(
    IN p_title VARCHAR(255),
    IN p_description TEXT,
    IN p_category_id INT,
    IN p_instructor_id INT
)
BEGIN
    DECLARE v_course_id INT;
    
    -- Start transaction
    START TRANSACTION;
    
    -- Insert course
    INSERT INTO courses (title, description, category_id, instructor_id)
    VALUES (p_title, p_description, p_category_id, p_instructor_id);
    
    -- Get the inserted course ID
    SET v_course_id = LAST_INSERT_ID();
    
    -- Commit transaction
    COMMIT;
    
    -- Return the course ID
    SELECT v_course_id;
END //
DELIMITER ;
