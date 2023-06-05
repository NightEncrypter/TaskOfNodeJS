const mongoose = require("mongoose");

// Define a schema
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  date: {
    type: Date,
    default: Date.now(),
  },
});

// Create a model
module.exports = mongoose.model("user", userSchema);
