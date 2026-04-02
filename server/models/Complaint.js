const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },

  // Transport (Bus / Train)
  mode: {
    type: String,
    required: true
  },

  dataType: {
    type: String
  },

  description: {
    type: String
  },

  // Issue from DL model
  issue: {
    type: String,
    required: true
  },

  // File (image/video path)
  file: {
    type: String,
    required: true
  },

  // Confidence (store as number, not string)
  confidence: {
    type: Number,
    default: 90
  },

  status: {
    type: String,
    default: "Pending"
  },
  priority: String, // HIGH, MEDIUM, LOW

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Complaint", complaintSchema);