/**
 * @desc    Handles 404 Not Found errors for invalid routes.
 */
export const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

/**
 * @desc    Standardizes all error responses into a consistent JSON format.
 *          Hides stack trace in production for security.
 */
export const errorHandler = (err, req, res, next) => {
  // If status code is 200 but an error occurred, default to 500 (Server Error)
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
  res.status(statusCode).json({
    success: false,
    message: err.message,
    // Hide stack trace in production environments
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};