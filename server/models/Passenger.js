const mongoose = require("mongoose");

const PassengerSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },

  password: {
    type: String,
    required: true
  },

  mobile: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true,
    unique: true
  }

}, { timestamps: true });

module.exports = mongoose.model("Passenger", PassengerSchema);