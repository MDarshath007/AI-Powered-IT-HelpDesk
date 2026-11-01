/**
 * 404 Not Found Middleware
 * Triggered when a requested endpoint is not defined
 */
export const notFoundHandler = (req, res, next) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Cannot ${req.method} ${req.originalUrl}`,
  });
};

/**
 * Global Error Handling Middleware
 * Centralizes uncaught errors across controllers and routes
 */
export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || err.status || 500;
  console.error(`[Error] ${err.message || 'Internal Server Error'}`);

  res.status(statusCode).json({
    error: err.name || 'Error',
    message: err.message || 'An unexpected server error occurred',
  });
};
