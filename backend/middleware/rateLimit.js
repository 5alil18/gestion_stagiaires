const rateLimit = require("express-rate-limit");

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  /////////////////15 minutes
  max: 5,
  message: {
    success: false,
    message: "Trop de tentatives. Réessayez plus tard.",
  },
});

module.exports = loginLimiter;
