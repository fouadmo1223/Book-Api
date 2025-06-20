const express = require("express");
const asyncHandler = require("express-async-handler");
const Book = require("../models/Book");
const Author = require("../models/Author");
const { bookSchema, updateBookSchema } = require("../utils/Schemas");
const { verifyToken, verifyTokenAndAdmin } = require("../middlewares/verfiyToken");

const router = express.Router();

// GET all books with author details
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1; // Default to page 1 if not specified
    const limit = 10; // 10 items per page
    const skip = (page - 1) * limit; // Calculate how many items to skip

    const [books, total] = await Promise.all([
      Book.find()
        .skip(skip)
        .limit(limit)
        .populate("author", "firstName lastName"),
      Book.countDocuments(), // Get total count of books
    ]);

    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      data: books,

      currentPage: page,
      totalPages,
      total,
    });
  })
);

// GET single book by ID
router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const book = await Book.findById(req.params.id).populate(
      "author",
      "firstName lastName nationality image"
    );

    if (!book) {
      res.status(404);
      throw new Error("Book not found");
    }

    res.status(200).json(book);
  })
);

// CREATE new book
router.post(
  "/",verifyToken,
  asyncHandler(async (req, res) => {
    // Validate the request body
    const { error, value } = bookSchema.validate(req.body, {
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
    const { author: authorId, title, price, description, cover } = req.body;

    // Check if author exists
    const authorExists = await Author.exists({ _id: authorId });
    if (!authorExists) {
      res.status(400);
      throw new Error("Author does not exist");
    }

    const book = await Book.create({
      title,
      author: authorId,
      price,
      description,
      cover,
    });

    const populatedBook = await Book.findById(book._id).populate(
      "author",
      "firstName lastName"
    );

    res.status(201).json(populatedBook);
  })
);

// UPDATE book
router.put(
  "/:id",verifyTokenAndAdmin,
  asyncHandler(async (req, res) => {
    const { error, value } = updateBookSchema.validate(req.body, {
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
    const { title, author: authorId, price, description, cover } = req.body;
    const book = await Book.findById(req.params.id);

    if (!book) {
      res.status(404);
      throw new Error("Book not found");
    }

    // Check if new author exists if being updated
    if (authorId) {
      const authorExists = await Author.exists({ _id: authorId });
      if (!authorExists) {
        res.status(400);
        throw new Error("Author does not exist");
      }
    }

    // Update book fields
    book.title = title || book.title;
    book.author = authorId || book.author;
    book.price = price || book.price;
    book.description = description || book.description;
    book.cover = cover || book.cover;

    const updatedBook = await book.save();
    const populatedBook = await Book.findById(updatedBook._id).populate(
      "author",
      "firstName lastName"
    );

    res.status(200).json({
      message: "Book updated successfully",
      book: populatedBook,
    });
  })
);

// DELETE book
router.delete(
  "/:id",verifyTokenAndAdmin,
  asyncHandler(async (req, res) => {
    const book = await Book.findByIdAndDelete(req.params.id);

    if (!book) {
      res.status(404);
      throw new Error("Book not found");
    }

    res.status(200).json({
      message: "Book deleted successfully",
      book: {
        _id: book._id,
        title: book.title,
      },
    });
  })
);

module.exports = router;
