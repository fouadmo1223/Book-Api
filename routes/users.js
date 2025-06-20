const express = require("express");
const { updateUserSchema } = require("../utils/Schemas");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const router = express.Router();
const User = require("../models/User");
const {
  verifyToken,
  verifyTokenAndAdmin,
  verifyTokenAndAuthorization,
} = require("../middlewares/verfiyToken");

router.put(
  "/:id",
  verifyToken,
  asyncHandler(async (req, res) => {
    const { id } = req.params;

    // Check if the requester is owner or admin
    if (req.user.id !== id && !req.user.isAdmin) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // Validate the body
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

    // Hash new password if provided
    let hashedPassword = undefined;
    if (value.password) {
      hashedPassword = await bcrypt.hash(value.password, 10);
    }

    // Update the user
    const updatedFields = {
      username: value.username,
      email: value.email,
    };
    if (hashedPassword) {
      updatedFields.password = hashedPassword;
    }

    const user = await User.findByIdAndUpdate(id, updatedFields, {
      new: true,
    }).select("-password -__v");

    if (user) {
      return res.status(200).json({
        message: "User updated successfully",
        user,
      });
    } else {
      return res.status(404).json({ message: "User not found" });
    }
  })
);

router.get(
  "/",
  verifyTokenAndAdmin,
  asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1; // Default to page 1 if not specified
    const limit = 10; // 10 items per page
    const skip = (page - 1) * limit; // Calculate how many items to skip

    const [users, total] = await Promise.all([
      User.find().skip(skip).limit(limit).select("-password -__v"),
      User.countDocuments(), // Get total count of books
    ]);

    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      data: users,
      currentPage: page,
      totalPages,
      total,
    });
  })
);

router.get(
  "/:id",
  verifyToken,
  asyncHandler(async (req, res) => {
    const { id } = req.params;

    // Check if the requester is owner or admin
    if (req.user.id !== id && !req.user.isAdmin) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const user = await User.findById(id).select("-password -__v");

    if (user) {
      return res.status(200).json({
        message: "User Found successfully",
        user,
      });
    } else {
      return res.status(404).json({ message: "User not found" });
    }
  })
);

router.delete(
  "/:id",
  verifyTokenAndAuthorization,
  asyncHandler(async (req, res) => {
    const user = await User.findByIdAndDelete(req.params.id).select(
      "-password -__v"
    );

    if (user) {
      return res.status(200).json({
        message: "User deleted successfully",
        user,
      });
    } else {
      return res.status(404).json({ message: "User not found" });
    }
  })
);

// Toggle block/unblock user
router.put(
  "/block/:id",
  verifyTokenAndAdmin,
  asyncHandler(async (req, res) => {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Reverse the current isBlocked value
    user.isBlocked = !user.isBlocked;
    await user.save();

    const updatedUser = await User.findById(id).select("-password -__v");

    res.status(200).json({
      message: `User has been ${user.isBlocked ? "blocked" : "unblocked"} successfully`,
      user: updatedUser,
    });
  })
);

module.exports = router;
