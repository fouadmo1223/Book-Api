// routes/commentRoutes.js
const express = require("express");
const asyncHandler = require("express-async-handler");
const Comment = require("../models/Comment");
const Post = require("../models/Post");
const {
  createCommentSchema,
  updateCommentSchema,
} = require("../utils/Schemas");
const { verifyToken, verifyTokenAndAuthorization } = require("../middlewares/verfiyToken");

const router = express.Router();

// Get all comments for a post
router.get(
  "/post/:postId",
  asyncHandler(async (req, res) => {
    const comments = await Comment.find({ post: req.params.postId }).populate(
      "user",
      "username"
    );
    res.status(200).json(comments);
  })
);

// Get my comments
router.get(
  "/me",
  verifyTokenAndAuthorization,
  asyncHandler(async (req, res) => {
    const comments = await Comment.find({ user: req.user.id }).populate(
      "post",
      "title"
    );
    res.status(200).json(comments);
  })
);

// Get single comment
router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const comment = await Comment.findById(req.params.id).populate(
      "user",
      "username"
    );
    if (!comment) return res.status(404).json({ message: "Comment not found" });
    res.status(200).json(comment);
  })
);

// Create comment
router.post(
  "/",
  verifyToken,
  asyncHandler(async (req, res) => {
    const { error, value } = createCommentSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      const errors = {};
      error.details.forEach((err) => (errors[err.context.key] = err.message));
      return res.status(400).json({ errors });
    }

    const postExists = await Post.exists({ _id: value.post });
    if (!postExists)
      return res.status(400).json({ message: "Post does not exist" });

    const comment = await Comment.create({
      user: req.user.id,
      post: value.post,
      text: value.text,
    });

    res.status(201).json(comment);
  })
);

// Update comment
router.put(
  "/:id",
  verifyTokenAndAuthorization,
  asyncHandler(async (req, res) => {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    if (comment.user.toString() !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const { error, value } = updateCommentSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      const errors = {};
      error.details.forEach((err) => (errors[err.context.key] = err.message));
      return res.status(400).json({ errors });
    }

    comment.text = value.text || comment.text;
    const updated = await comment.save();
    res.status(200).json(updated);
  })
);

// Delete comment
router.delete(
  "/:id",
  verifyTokenAndAuthorization,
  asyncHandler(async (req, res) => {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    if (comment.user.toString() !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await comment.remove();
    res.status(200).json({ message: "Comment deleted" });
  })
);

module.exports = router;
