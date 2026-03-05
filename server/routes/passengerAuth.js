const express = require("express");
const router = express.Router();
const Passenger = require("../models/Passenger");
const bcrypt = require("bcryptjs");


// Passenger Signup
router.post("/signup", async (req, res) => {

  try {

    const { username, password, mobile, email } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const newPassenger = new Passenger({
      username,
      password: hashedPassword,
      mobile,
      email
    });

    await newPassenger.save();
    res.json({
      message: "Login successful",
      user: {
        username: user.username,
        email: user.email
      }
    });

    res.json({ message: "Passenger registered successfully" });

  } catch (error) {
    res.status(500).json({ message: "Error registering passenger" });
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

module.exports = router;