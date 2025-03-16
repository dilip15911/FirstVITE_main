-- Add new columns to users table if they don't exist
ALTER TABLE users
ADD COLUMN IF NOT EXISTS mobile VARCHAR(15) DEFAULT NULL,
ADD COLUMN IF NOT EXISTS course VARCHAR(100) DEFAULT NULL;

-- Create user_history table if not exists
CREATE TABLE IF NOT EXISTS user_history (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  mobile VARCHAR(15) DEFAULT NULL,
  course VARCHAR(100) DEFAULT NULL,
  action_type ENUM('UPDATE', 'RESTORE') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
