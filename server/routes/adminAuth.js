const express = require("express");
const router = express.Router();
const sendOtpMail = require("../utils/sendMail");

let generatedOtp = null;

const ADMIN_USERNAME = "admin123";
const ADMIN_PASSWORD = "Admin@123";

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {

    generatedOtp = Math.floor(100000 + Math.random() * 900000);

    await sendOtpMail(generatedOtp);

    res.json({ message: "OTP sent to email" });

  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
});

router.post("/verify-otp", (req, res) => {
  const { otp } = req.body;

  if (parseInt(otp) === generatedOtp) {
    res.json({ message: "Login successful" });
  } else {
    res.status(400).json({ message: "Invalid OTP" });
  }
});

module.exports = router;