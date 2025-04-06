# Full-Stack React + Express + MySQL Application

This is a full-stack application using React for the frontend, Express.js for the backend, and MySQL for the database.

## Setup Instructions

1. Install dependencies:
   ```bash
   # Install backend dependencies
   npm install
   
   # Install frontend dependencies
   cd client
   npm install
   ```

2. Set up MySQL:
   - Create a MySQL database named 'fullstack_db'
   - Update the `.env` file with your MySQL credentials

3. Start the application:
   ```bash
   # Start both frontend and backend in development mode
   npm run dev
   ```

The frontend will run on http://localhost:3000 and the backend on http://localhost:5000.

## Project Structure

- `/client` - React frontend application
- `/server` - Express backend application
- `.env` - Environment configuration
- `package.json` - Project dependencies and scripts
