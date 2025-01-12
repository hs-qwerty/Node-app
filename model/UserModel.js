const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    max: 255,
    min: 6,
  },
  password: {
    type: String,
    required: true,
    max: 1024,
    min: 6,
  },
  name: {
    type: String,
    require: true,
    min: 3,
    max: 15,
  },
  apikey: {
    type: String,
    require: true,
    max: 15,
    min: 1,
  },
  status: {
    type: String,
    require: true,
    max: 3,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("UserModels", userSchema);
