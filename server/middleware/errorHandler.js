const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  // Database errors
  if (err.code === 'ER_DUP_ENTRY') {
    return res.status(400).json({
      message: 'This record already exists',
    });
  }

  if (err.code === 'ER_NO_REFERENCED_ROW') {
    return res.status(400).json({
      message: 'Referenced record does not exist',
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      message: 'Invalid token',
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      message: 'Token expired',
    });
  }

  // Validation errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      message: err.message,
    });
  }

  // Default error
  res.status(500).json({
    message: 'Something went wrong!',
  });
};

module.exports = errorHandler;
