// routes/postRoutes.js
const express = require("express");
const asyncHandler = require("express-async-handler");
const Post = require("../models/Post");
const Comment = require("../models/Comment");
const { createPostSchema, updatePostSchema } = require("../utils/Schemas");
const {
  verifyToken,
  verifyTokenAndAdmin,
} = require("../middlewares/verfiyToken");

const router = express.Router();

// Get all posts with comments
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const posts = await Post.find().populate("user", "username email");

    const postsWithComments = await Promise.all(
      posts.map(async (post) => {
        const comments = await Comment.find({ post: post._id }).populate(
          "user",
          "username"
        );
        return { ...post.toObject(), comments };
      })
    );

    res.status(200).json(postsWithComments);
  })
);

// Get my posts with comments
router.get(
  "/me",
  verifyTokenAndAdmin,
  asyncHandler(async (req, res) => {
    const posts = await Post.find({ user: req.user.id }).populate(
      "user",
      "username email"
    );

    const postsWithComments = await Promise.all(
      posts.map(async (post) => {
        const comments = await Comment.find({ post: post._id }).populate(
          "user",
          "username"
        );
        return { ...post.toObject(), comments };
      })
    );

    res.status(200).json(postsWithComments);
  })
);

// Get single post with comments
router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const post = await Post.findById(req.params.id).populate(
      "user",
      "username email"
    );
    if (!post) return res.status(404).json({ message: "Post not found" });

    const comments = await Comment.find({ post: post._id }).populate(
      "user",
      "username"
    );

    res.status(200).json({ ...post.toObject(), comments });
  })
);

// Create new post
router.post(
  "/",
  verifyToken,
  asyncHandler(async (req, res) => {
    const { error, value } = createPostSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      const errors = {};
      error.details.forEach((err) => (errors[err.context.key] = err.message));
      return res.status(400).json({ errors });
    }
    const post = await Post.create({
      user: req.user.id,
      title: value.title,
      description: value.description,
    });
    res.status(201).json(post);
  })
);

// Update post
router.put(
  "/:id",
  verifyTokenAndAdmin,
  asyncHandler(async (req, res) => {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.user.toString() !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const { error, value } = updatePostSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      const errors = {};
      error.details.forEach((err) => (errors[err.context.key] = err.message));
      return res.status(400).json({ errors });
    }

    post.title = value.title || post.title;
    post.description = value.description || post.description;
    const updated = await post.save();
    res.status(200).json(updated);
  })
);

// Delete post
router.delete(
  "/:id",
  verifyTokenAndAdmin,
  asyncHandler(async (req, res) => {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.user.toString() !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await post.remove();
    res.status(200).json({ message: "Post deleted" });
  })
);

module.exports = router;
