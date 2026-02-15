require("dotenv").config();

const express = require("express");
const app = express();   // ✅ app must be defined BEFORE using it
const cors = require("cors");

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/admin", require("./routes/adminAuth"));

// Server start
const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});