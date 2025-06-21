const express = require("express");
require("dotenv").config();
const app = express();
const path = require("path");
var cors = require("cors");
const helmet = require("helmet");
const booksPath = require("./routes/books");
const authorsPath = require("./routes/authors");
const authPath = require("./routes/auth");
const usersPath = require("./routes/users");
const postsPath = require("./routes/posts");
const profilePath = require("./routes/profile");
const commentsPath = require("./routes/comments");
const { notFound, errorHandeler } = require("./middlewares/errors");
const connectDB = require("./config/db");

// middleWares
app.use(helmet());
app.use(express.json()); // for parsing application/json
app.use("/images", express.static(path.join(__dirname, "images")));
app.use(cors());
connectDB();

// Routes
app.use("/api/books", booksPath);
app.use("/api/authors", authorsPath);
app.use("/api/auth", authPath);
app.use("/api/users", usersPath);
app.use("/api/posts", postsPath);
app.use("/api/comments", commentsPath);
app.use("/api", profilePath);

// Error Handler
// it must be in that order
app.use(notFound);

app.use(errorHandeler);

// luncing server
const PORT = 4040;
app.listen(PORT, (req, res) => {
  console.log(`lesiting to port ${PORT}`);
});
