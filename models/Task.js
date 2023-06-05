const mongoose = require("mongoose");

// Define a schema
const taskSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectID,

    ref: "users",
  },
  name: String,
  type: String,
  desc: String,
});

// Create a model
module.exports = mongoose.model("task", taskSchema);
