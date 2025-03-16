-- Create the database if it doesn't exist
CREATE DATABASE IF NOT EXISTS firstvite_app;
USE firstvite_app;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    is_verified BOOLEAN DEFAULT FALSE
);

-- Verifications table for OTP
CREATE TABLE IF NOT EXISTS verifications (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    otp VARCHAR(6) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- User history table to track changes
CREATE TABLE IF NOT EXISTS user_history (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    name VARCHAR(255),
    email VARCHAR(255),
    action_type ENUM('UPDATE', 'RESTORE') NOT NULL,
    changed_by INT,
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (changed_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Trigger to track user updates
DELIMITER //
CREATE TRIGGER IF NOT EXISTS after_user_update
AFTER UPDATE ON users
FOR EACH ROW
BEGIN
    IF OLD.name != NEW.name OR OLD.email != NEW.email THEN
        INSERT INTO user_history (user_id, name, email, action_type, changed_by)
        VALUES (OLD.id, OLD.name, OLD.email, 'UPDATE', @user_id);
    END IF;
END;
//
DELIMITER ;

-- Create default admin user (password: admin123)
INSERT INTO users (name, email, password, is_verified) 
VALUES ('Admin', 'admin@firstvite.com', '$2a$10$XFtx0bx6UVjAK7OXwF/H3.QF0Gu7xFqYKhWGwN6833Jv9hO9O1vLe', true)
ON DUPLICATE KEY UPDATE email = email;

-- Sessions table for managing user sessions
CREATE TABLE IF NOT EXISTS sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    token VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Password reset tokens table
CREATE TABLE IF NOT EXISTS password_resets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    token VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
