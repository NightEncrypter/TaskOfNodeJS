const express = require("express");

const router = express.Router();

const { check, validationResult } = require("express-validator");

// MIDDLEWARE
const auth = require("../middlewares/auth");
const Task = require("../models/Task");

router.get("/", auth, async (req, res) => {
  try {
    const task = await Task.find({ user: req.user.id }).sort({ date: -1 });

    res.json(task);
  } catch (e) {
    console.error(e.message);
    res.status(500).send("Server Error");
  }
});

router.post(
  "/",
  [auth, [check("name", "Name is required").notEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors });
    }

    const { name, type, desc } = req.body;

    try {
      const newTask = new Task({
        name,
        type,
        desc,
        user: req.user.id,
      });

      console.log(newTask);

      const task = await newTask.save();

      res.json(task);
    } catch (e) {
      console.error(e.message);
      res.status(500).send("Server Error");
    }
  }
);

module.exports = router;
