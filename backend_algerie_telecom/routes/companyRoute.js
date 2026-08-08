const express = require("express");

const {
  registerController,
  loginController,
  verifyController,
  forgotController,
  resetController
} = require("../controller/companyController");

const rateLimite = require('../middleware/rateLimit')

const router = express.Router();

router.post("/register", registerController);
router.post("/login",rateLimite,loginController);
router.get("/verifyEmail/:token", verifyController);
router.post('/forgotPassword',forgotController )
router.post('/resetPassword/:token', resetController)

module.exports = router;
