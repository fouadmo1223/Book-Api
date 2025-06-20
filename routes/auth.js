const express = require("express");
const { updateUserSchema, createUserSchema } = require("../utils/Schemas");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const router = express.Router();
const User = require("../models/User");

router.post(
  "/register",
  asyncHandler(async (req, res) => {
    if (!req.body || typeof req.body !== "object") {
      return res.status(400).json({ message: "Invalid request body" });
    }

    const { error, value } = createUserSchema.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      const errors = {};
      error.details.forEach((err) => {
        errors[err.context.key] = err.message;
      });
      return res.status(400).json({ errors });
    }

    let user = await User.findOne({ email: value.email });
    if (user) {
      return res.status(400).json({ message: "User exists before" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(value.password, salt);

    user = new User({
      username: value.username,
      email: value.email,
      password: hashedPassword,
      isAdmin: value.isAdmin,
    });

    user = await user.save();

    res.status(201).json({
      id: user._id,
      username: user.username,
      email: user.email,
      isAdmin: false,
    });
  })
);

router.post(
  "/login",
  asyncHandler(async (req, res) => {
    if (!req.body || typeof req.body !== "object") {
      return res.status(400).json({ message: "Invalid request body" });
    }

    const { error, value } = updateUserSchema.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      const errors = {};
      error.details.forEach((err) => {
        errors[err.context.key] = err.message;
      });
      return res.status(400).json({ errors });
    }

    const user = await User.findOne({ email: value.email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    if (user.isBlocked) {
      return res.status(400).json({ message: "You Are Blocked " });
    }

    const isPasswordMatch = await bcrypt.compare(value.password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      id: user._id,
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin,
      token,
    });
  })
);

module.exports = router;
