const mongoose = require("mongoose");

const ItemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
    min: 6,
    max: 255,
  },
  content: {
    type: String,
    require: true,
    min: 2,
    max: 1001,
  },
  user: {
    type: String,
    require: true,
  },
  status: {
    type: String,
    require: true,
    max: 2,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("itemModel", ItemSchema);
