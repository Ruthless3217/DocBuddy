/**
 * Rate Limiter Middleware
 */

const rateLimit = require('express-rate-limit');
const logger = require('../config/logger');

const rateLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || 900000), // 15 minutes by default
  max: parseInt(process.env.RATE_LIMIT_MAX || 100), // Limit each IP to 100 requests per windowMs
  standardHeaders: true, // Use standard RateLimit headers (Retry-After, etc)
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (req, res, next, options) => {
    logger.warn(`Rate limit exceeded for IP: ${req.ip} on URL: ${req.originalUrl}`);
    res.status(429).json({
      success: false,
      message: 'Too many requests, please try again later.',
    });
  },
});

module.exports = rateLimiter;
