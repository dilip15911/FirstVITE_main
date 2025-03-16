-- Create database if not exists
CREATE DATABASE IF NOT EXISTS firstvite_app;
USE firstvite_app;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') DEFAULT 'user',
    is_verified BOOLEAN DEFAULT FALSE,
    profile_picture VARCHAR(255),
    reset_token VARCHAR(255),
    reset_token_expires DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Verifications table for email verification
CREATE TABLE IF NOT EXISTS verifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    otp VARCHAR(6) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- User history table for tracking changes
CREATE TABLE IF NOT EXISTS user_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    name VARCHAR(255),
    email VARCHAR(255),
    action_type ENUM('UPDATE', 'RESTORE') NOT NULL,
    changed_by INT,
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (changed_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Create default admin user (password: admin123)
INSERT INTO users (name, email, password, role, is_verified) 
VALUES (
    'Admin', 
    'admin@firstvite.com',
    '$2a$10$XFtx0bx6UVjAK7OXwF/H3.QF0Gu7xFqYKhWGwN6833Jv9hO9O1vLe',
    'admin',
    TRUE
) ON DUPLICATE KEY UPDATE email = email;
