const express = require("express");
require("dotenv").config();
const app = express();

const booksPath = require("./routes/books");
const authorsPath = require("./routes/authors");
const authPath = require("./routes/auth");
const usersPath = require("./routes/users");
const { notFound, errorHandeler } = require("./middlewares/errors");
const connectDB = require("./config/db");
app.use(express.json()); // for parsing application/json

connectDB();

// Routes
app.use("/api/books", booksPath);
app.use("/api/authors", authorsPath);
app.use("/api/auth", authPath);
app.use("/api/users", usersPath);

// Error Handler
// it must be in that order
app.use(notFound);

app.use(errorHandeler);

// luncing server
const PORT = 4040;
app.listen(PORT, (req, res) => {
  console.log(`lesiting to port ${PORT}`);
});
