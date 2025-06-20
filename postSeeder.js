const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Post = require("./models/Post"); // Adjust path if needed

dotenv.config();

// Connect to DB
mongoose
  .connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// Static users (from your request)
const userIds = [
  "68541bb288a344ac073aae55",
  "68541d7cb3ac46495698f7c4",
  "68555f414d8cc9fef3dc3772",
];

// Sample post data
const posts = [
  {
    title: "First Post",
    description: "A brief about the first post.",
    user: userIds[0],
  },
  {
    title: "Second Post",
    description: "Overview of the second post content.",
    user: userIds[1],
  },
  {
    title: "Third Post",
    description: "What’s covered in this post about tech.",
    user: userIds[2],
  },
  {
    title: "Learning JavaScript",
    description: "Post about JavaScript basics and tips.",
    user: userIds[0],
  },
  {
    title: "Node.js is awesome!",
    description: "Why Node.js is loved by developers.",
    user: userIds[1],
  },
];
  

// Seed function
const seedPosts = async () => {
  try {
    await Post.deleteMany();
    await Post.insertMany(posts);
    console.log("✅ Posts Seeded Successfully");
    process.exit();
  } catch (err) {
    console.error("❌ Error seeding posts:", err);
    process.exit(1);
  }
};

seedPosts();
