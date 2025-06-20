const mongoose = require("mongoose");
const AuthorSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 50,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },
    nationality: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },
    image: {
      type: String,
      default: "default.png",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Author", AuthorSchema);
