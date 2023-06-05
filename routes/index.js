const express = require("express");

const router = express.Router();

const bcrypt = require("bcryptjs");
const config = require("config");

const { check, validationResult } = require("express-validator");

const jwt = require("jsonwebtoken");

const auth = require("../middlewares/auth");

const User = require("../models/User");

// PRIVATE
router.get("/user", auth, async (req, res) => {
  try {
    const getUser = await User.findById(req.user.id).select("-password");

    res.json(getUser);
  } catch (err) {
    console.error(err.message);

    res.status(500).send("Server error");
  }
});

// @route POST api/users
// @desc Login a user

router.post(
  "/login",
  [
    check("email", "Please enter valid email").notEmpty(),
    check("password", "Please enter valid password ").isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email });

      if (!user) {
        return res.status(400).json({ msg: "user not found" });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({ msg: "user not found" });
      }

      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(payload, config.get("secret"), (err, token) => {
        res.json({ token });

        if (err) throw err;
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// Register Method
// POST METHOD
// PUBLIC
router.post(
  "/register",
  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check("password", "Please with 6 or more character").isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;
    try {
      let user = await User.findOne({ email });

      if (user) {
        return res.status(400).json({ msg: "user already exist" });
      }
      user = new User({
        name,
        email,
        password,
      });

      user.password = await bcrypt.hash(password, 10);

      await user.save();

      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(payload, config.get("secret"), (err, token) => {
        if (err) throw err;

        res.json({ token: token });
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

module.exports = router;
