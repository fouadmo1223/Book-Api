const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      trim: true,
      minlength: [2, "Username must be at least 2 characters"],
      maxlength: [200, "Username cannot exceed 200 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      unique: true,

      minlength: [3, "Email must be at least 3 characters"],
      maxlength: [100, "Email cannot exceed 100 characters"],
      validate: {
        validator: function (value) {
          // must have @ and ., and at least one word after the last dot
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        },
        message: "Enter a valid E-Mail ",
      },
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      trim: true,
      minlength: [6, "Password must be at least 6 characters"],
      validate: {
        validator: function (value) {
          // at least one digit and one special character
          return /[0-9]/.test(value) && /[!@#$%^&*(),.?":{}|<>]/.test(value);
        },
        message:
          "Password must contain at least one number and one special character",
      },
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    resetPasswordToken: {
      type: String,
    },
    resetPasswordExpires: {
      type: Date,
    },
    profileImage: {
      url: {
        type: String,
        default:
          "https://res.cloudinary.com/demo/image/upload/v1711111111/default-profile.png", // Replace with your actual default image URL
      },
      publicId: {
        type: String,
        default: null,
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", UserSchema);
