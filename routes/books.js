const express = require("express");

const {
  verifyToken,
  verifyTokenAndAdmin,
} = require("../middlewares/verfiyToken");
const { getAllBooks, getBook, createBook, getBookById, updateBook, deleteBook } = require("../controllers/bookController");
const router = express.Router();

// GET all books with optional filters and pagination
router.get("/", getAllBooks);

// GET single book by ID
router.get("/:id", getBookById);

// CREATE new book
router.post("/", verifyToken, createBook);

// UPDATE book
router.put("/:id", verifyTokenAndAdmin, updateBook);

// DELETE book
router.delete("/:id", verifyTokenAndAdmin, deleteBook);

module.exports = router;
