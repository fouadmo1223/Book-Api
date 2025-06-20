const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Book title is required"],
      trim: true,
      minlength: [3, "Title must be at least 3 characters long"],
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "Author reference is required"],
      ref: "Author",
      validate: {
        validator: async function (v) {
          const author = await mongoose.model("Author").findById(v);
          return author !== null;
        },
        message: "Author with this ID does not exist",
      },
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    description: {
      type: String,
      trim: true,
      minlength: [10, "Description must be at least 10 characters"],
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    cover: {
      type: String,
      trim: true,
      minlength: [4, "Cover must be at least 4 characters long"],
      maxlength: [100, "Cover cannot exceed 100 characters"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Book", bookSchema);
