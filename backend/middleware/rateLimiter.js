const rateLimit = require('express-rate-limit');

// General API rate limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    success: false,
    error: 'Too many requests, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Auth routes rate limiter (stricter)
const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // Limit each IP to 5 requests per hour
  message: {
    success: false,
    error: 'Too many login attempts, please try again after an hour.'
  },
  skipSuccessfulRequests: true,
});

// Booking rate limiter
const bookingLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20, // 20 bookings per hour
  message: {
    success: false,
    error: 'Too many booking attempts, please try again later.'
  },
});

module.exports = { apiLimiter, authLimiter, bookingLimiter };