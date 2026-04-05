require("dotenv").config();

const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/admin", require("./routes/adminAuth"));
app.use("/api/passenger", require("./routes/passengerAuth"));
app.use("/api/complaints", require("./routes/complaints"));
app.use("/uploads", express.static("uploads"));
app.use("/api/admin", require("./routes/adminRoutes"));


// MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/rtc_transport_issues")
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log("MongoDB Error:", err));

// Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});