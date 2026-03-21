const express = require("express");
const router = express.Router();
const Passenger = require("../models/Passenger");
const bcrypt = require("bcryptjs");


// Passenger Signup
router.post("/signup", async (req, res) => {

  try {
    const { username, password, mobile, email } = req.body;

    const existingUser = await Passenger.findOne({ username });

    if (existingUser) {
      return res.status(400).json({
        message: "Username already exists"
      });
    }

    // 🔥 HASH PASSWORD
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new Passenger({
      username,
      password: hashedPassword,   // ✅ store hashed password
      mobile,
      email
    });

    await newUser.save();

    res.json({ message: "Signup successful" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }

});

// Passenger Login
router.post("/login", async (req, res) => {

  const { username, password } = req.body;

  const user = await Passenger.findOne({ username });

  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(401).json({ message: "Invalid password" });
  }

  res.json({ message: "Login successful", user });

});

router.post("/send-otp", async (req, res) => {

  const { email } = req.body;

  const otp = Math.floor(100000 + Math.random() * 900000);

  console.log("OTP:", otp);

  // store OTP temporarily (for now simple)
  global.otpStore = { email, otp };

  res.json({ message: "OTP sent to your email (check console for now)" });
});

router.post("/reset-password", async (req, res) => {

  const { email, otp, newPassword } = req.body;

  if (!global.otpStore || global.otpStore.email !== email) {
    return res.status(400).json({ message: "Invalid email" });
  }

  if (global.otpStore.otp != otp) {
    return res.status(400).json({ message: "Invalid OTP" });
  }

const hashedPassword = await bcrypt.hash(newPassword, 10);

  await Passenger.updateOne(
    { email },
    { password: newPassword }
  );

  res.json({ message: "Password reset successful" });
});

module.exports = router;