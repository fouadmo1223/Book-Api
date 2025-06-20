const express = require("express");
const { createAuthorSchema, updateAuthorSchema } = require("../utils/Schemas");
const asyncHandler = require("express-async-handler");
const Author = require("../models/Author");
const { verifyTokenAndAdmin, verifyToken } = require("../middlewares/verfiyToken");

const router = express.Router();
// async handeler instead of try and catch
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;
    const paginatedAuthors = await Author.find()
      .limit(limit)
      .skip(skip)
      .select("-__v");
    const total = await Author.countDocuments();

    return res.status(200).json({
      currentPage: page,
      total,
      totalPages: Math.ceil(total / limit),
      data: paginatedAuthors,
    });
  })
);

router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const author = await Author.findById(id).select("-__v");
    if (!author) {
      return res.status(404).json({ message: "Author Not Found" });
    }
    res.status(200).json(author);
    res.end();
  })
);

router.post("/",verifyToken, async (req, res) => {
  // Validate the request body
  const { error, value } = createAuthorSchema.validate(req.body, {
    abortEarly: false,
  });

  // If validation fails, format errors into { field: message } object
  if (error) {
    const errors = {};
    error.details.forEach((err) => {
      errors[err.context.key] = err.message;
    });
    return res.status(400).json({ errors });
  }

  // If validation passes, create the authot
  try {
    const newAuthor = new Author({
      firstName: value.firstName,
      lastName: value.lastName,
      nationality: value.nationality,
      image: value.image,
    });
    const author = await newAuthor.save();
    res.status(201).json(author);
  } catch (err) {
    res.status(500).json({ message: "something went wrong" });
  }
});

router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
  const { id } = req.params;
  const { error, value } = updateAuthorSchema.validate(req.body, {
    abortEarly: false,
  });
  // If validation fails, format errors into { field: message } object
  if (error) {
    const errors = {};
    error.details.forEach((err) => {
      errors[err.context.key] = err.message;
    });
    return res.status(400).json({ errors });
  }
  const author = await Author.findByIdAndUpdate(
    id,
    {
      firstName: value.firstName,
      lastName: value.lastName,
      nationality: value.nationality,
      image: value.image,
    },
    { new: true }
  ).select("-__v");

  if (author) {
    return res
      .status(200)
      .json({ message: "author Updated Sucessfully", author });
  } else {
    return res.status(404).json({ message: "author Not Found" });
  }
});
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
  const { id } = req.params;

  const author = await Author.findById(id);
  if (author) {
    await Author.findByIdAndDelete(id);
    return res
      .status(200)
      .json({ message: "author Delted Sucessfully", author });
  } else {
    return res.status(404).json({ message: "author Not Found" });
  }
});
module.exports = router;
