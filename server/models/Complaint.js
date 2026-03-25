const multer = require("multer");
const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema({
  username: String,
  mode: String,
  dataType: String,
  description: String,
  caption: String,
  issue: String,
  status: {
    type: String,
    default: "Pending"
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Complaint", complaintSchema);