const mongoose = require("mongoose");

// Define a schema
const userSchema = new mongoose.Schema({
  name: String,
  type: String,
  desc: String,
});

// Create a model
module.exports = mongoose.model("task", userSchema);
