const mongoose = require("mongoose");
async function connectDB() {
 await mongoose
    .connect(process.env.DB_URL)
    .then(() => {
      console.log("conected to db");
    })
    .catch((err) => {
      console.log("failed to connect", err);
    });
}
module.exports = connectDB;
