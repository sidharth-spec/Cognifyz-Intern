const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3, // Limit each IP to 3 requests per window
  message: {
    error: "Too many requests, please try again later",
    status: 429,
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = limiter;
