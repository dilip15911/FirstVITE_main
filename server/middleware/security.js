const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const xss = require('xss-clean');
const hpp = require('hpp');

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes',
});

// Auth routes rate limiting
const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // Limit each IP to 5 login/signup requests per hour
  message: 'Too many auth attempts from this IP, please try again after an hour',
});

const securityMiddleware = [
  // Set security HTTP headers
  helmet(),
  
  // Prevent XSS attacks
  xss(),
  
  // Prevent HTTP Parameter Pollution attacks
  hpp(),
  
  // Add other security middleware as needed
];

module.exports = {
  limiter,
  authLimiter,
  securityMiddleware,
};
