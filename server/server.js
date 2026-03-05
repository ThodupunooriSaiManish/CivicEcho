require("dotenv").config();

const mongoose = require("mongoose");



const express = require("express");
const app = express();   // ✅ app must be defined BEFORE using it
const cors = require("cors");

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/admin", require("./routes/adminAuth"));
app.use("/api/passenger", require("./routes/passengerAuth"));

// Server start
const PORT = 5000;

// MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/rtc_transport_issues")
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));



app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});