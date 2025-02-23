require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const userRoutes = require('./routes/user');
const adminRoutes = require('./routes/admin');
const pool = require('./database/db');
const app = express();
const PORT = process.env.PORT || 3001;


const authMiddleware = require("./middleware/authMiddleware");
const errorHandler = require("./middleware/errorHandler");


//  Test Route (No Auth Required)
app.get("/", (req, res) => {
  res.send("Hello, Express is working!");
});


// Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


//  Middleware for Error Handling
app.use(errorHandler);

// Test database connection
const testDbConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✓ Database connection successful');
    connection.release();
    return true;
  } catch (error) {
    console.error('✗ Database connection failed:', error);
    return false;
  }
};

// Routes
app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);


//  Protected Route (JWT required)
app.use('/api/user/protected', authMiddleware, (req, res) => {
  res.json({ message: "Access granted!", user: req.user });
});



//  Middlewares
app.use(express.json()); // JSON parsing
app.use(cors()); // Enable CORS

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      message: err.message
    });
  }
  
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({
      message: 'Invalid token'
    });
  }
  
  res.status(500).json({
    message: process.env.NODE_ENV === 'development' 
      ? err.message 
      : 'An unexpected error occurred'
  });
});

// Function to find an available port
const findAvailablePort = async (startPort) => {
  const net = require('net');
  
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    
    server.listen(startPort, () => {
      const { port } = server.address();
      server.close(() => resolve(port));
    });

    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        // Port is in use, try the next one
        findAvailablePort(startPort + 1)
          .then(resolve)
          .catch(reject);
      } else {
        reject(err);
      }
    });
  });
};

// Start server
const startServer = async () => {
  try {
    // Test database connection first
    const dbConnected = await testDbConnection();
    if (!dbConnected) {
      console.error('✗ Failed to connect to database. Please check your database configuration.');
      process.exit(1);
    }

    // Find available port
    const availablePort = await findAvailablePort(PORT);
    
    // Start the server
    app.listen(availablePort, () => {
      console.log(`✓ Server is running on port ${availablePort}`);
      if (availablePort !== PORT) {
        console.log(`Note: Original port ${PORT} was in use, using port ${availablePort} instead`);
      }
      console.log(`✓ Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
    });

  } catch (error) {
    console.error('✗ Failed to start server:', error);
    process.exit(1);
  }
};

// Handle process termination
process.on('SIGTERM', () => {
  console.log('Received SIGTERM. Performing graceful shutdown...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('Received SIGINT. Performing graceful shutdown...');
  process.exit(0);
});

startServer();


// const express = require("express");
// const mongoose = require("mongoose");
// const dotenv = require("dotenv");
// const cors = require("cors");

// const authMiddleware = require("./middlewares/authMiddleware");
// const errorHandler = require("./middlewares/errorHandler");

// dotenv.config();
// const app = express();

// // ✅ Middlewares
// app.use(express.json()); // JSON parsing
// app.use(cors()); // Enable CORS

// // ✅ Test Route (No Auth Required)
// app.get("/", (req, res) => {
//   res.send("Hello, Express is working!");
// });

// // ✅ Protected Route (JWT required)
// app.get("/protected", authMiddleware, (req, res) => {
//   res.json({ message: "Access granted!", user: req.user });
// });

// // ✅ Middleware for Error Handling
// app.use(errorHandler);

// // ✅ Database Connection (MongoDB)
// mongoose
//   .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => console.log("✅ MongoDB Connected"))
//   .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// // ✅ Start Server
// const PORT = process.env.PORT || 3001;
// app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
