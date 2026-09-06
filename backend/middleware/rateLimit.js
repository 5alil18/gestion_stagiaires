const rateLimit = require("express-rate-limit");

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, /////////////////15 minutes
  max: 5,
  message: {
    success: false,
    message: "many requirest please try again after 15 minutes",
  },
});

module.exports = loginLimiter;
