const asyncHandler = require("express-async-handler");
const { bookSchema, updateBookSchema } = require("../utils/Schemas");
const Book = require("../models/Book");
const Author = require("../models/Author");

const getAllBooks = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 10;
  const skip = (page - 1) * limit;

  const { price, comparison } = req.query;
  const query = {};

  // Add price filtering if provided
  if (price && comparison) {
    const p = parseFloat(price);

    switch (comparison) {
      case "eq":
        query.price = p;
        break;
      case "neq":
        query.price = { $ne: p };
        break;
      case "gt":
        query.price = { $gt: p };
        break;
      case "lt":
        query.price = { $lt: p };
        break;
      case "between":
        const max = parseFloat(req.query.maxPrice);
        if (!isNaN(max)) {
          query.price = { $gte: p, $lte: max };
        }
        break;
      default:
        break;
    }
  }

  const [books, total] = await Promise.all([
    Book.find(query)
      .skip(skip)
      .limit(limit)
      .populate("author", "firstName lastName"),
    Book.countDocuments(query),
  ]);

  const totalPages = Math.ceil(total / limit);

  res.status(200).json({
    data: books,
    currentPage: page,
    totalPages,
    total,
  });
});

const getBookById = asyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.id).populate(
    "author",
    "firstName lastName nationality image"
  );

  if (!book) {
    res.status(404);
    throw new Error("Book not found");
  }

  res.status(200).json(book);
});

const createBook = asyncHandler(async (req, res) => {
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
});

const updateBook = asyncHandler(async (req, res) => {
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
});

const deleteBook = asyncHandler(async (req, res) => {
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
});

module.exports = {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
};
