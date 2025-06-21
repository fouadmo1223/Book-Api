const express = require("express");
const asyncHandler = require("express-async-handler");
const fs = require("fs");
const path = require("path");
const User = require("../models/User");
const cloudinary = require("../utils/cloudinary");
const {
  verifyTokenAndAuthorization
} = require("../middlewares/verfiyToken");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

const router = express.Router();

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "book-api/profile-images",
    allowed_formats: ["jpg", "jpeg", "png"],
    transformation: [{ width: 300, height: 300, crop: "limit" }],
  },
});

const upload = multer({ storage });
router.post(
  "/:id/profile",
  verifyTokenAndAuthorization,
  upload.single("image"),
  asyncHandler(async (req, res) => {
    if (!req.file || !req.file.path || !req.file.filename) {
      return res.status(400).json({ message: "No image uploaded" });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Delete old image from Cloudinary if it exists
    if (user.profileImage && user.profileImage.publicId) {
      await cloudinary.uploader.destroy(user.profileImage.publicId);
    }

    // Save new image info
    user.profileImage = {
      url: req.file.path,
      publicId: req.file.filename,
    };
    await user.save();

    res.status(200).json({
      message: "Profile image uploaded to Cloudinary",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        profileImage: user.profileImage.url,
      },
    });
  })
);
module.exports = router;