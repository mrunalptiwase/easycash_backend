const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  reward: {
    type: Number,
    required: true
  },
  link: String,
  type: {
    type: String,
    enum: ["visit", "download", "signup"],
    default: "visit"
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Task", taskSchema);
