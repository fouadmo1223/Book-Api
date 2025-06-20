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

const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");

// Forgot Password
router.post(
  "/forgot-password",
  asyncHandler(async (req, res) => {
    const { email, redirectUrl } = req.body;

    if (!email || !redirectUrl) {
      return res
        .status(400)
        .json({ message: "Email and redirectUrl are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "No user found with that email" });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordToken = tokenHash;
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 min
    await user.save();

    const resetLink = `${redirectUrl}?token=${resetToken}`;

    const html = `
      <p>Hello ${user.username},</p>
      <p>You requested a password reset.</p>
      <p>Click below to reset your password:</p>
      <a href="${resetLink}">${resetLink}</a>
      <p>This link will expire in 15 minutes.</p>
    `;

    await sendEmail(user.email, "Password Reset", html);

    res.status(200).json({ message: "Password reset email sent" });
  })
);

// Reset Password
router.post(
  "/reset-password",
  asyncHandler(async (req, res) => {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res
        .status(400)
        .json({ message: "Token and new password are required" });
    }

    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: tokenHash,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.status(200).json({ message: "Password reset successfully" });
  })
);



module.exports = router;
