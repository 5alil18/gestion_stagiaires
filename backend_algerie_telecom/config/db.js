const mongoose = require("mongoose");
const mongo = process.env.mongo_uri;

const connectDB = async () => {
  try {
    await mongoose.connect(mongo);
    console.log("MongoDB connected successfully");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
    process.exit(1);
  }
};

module.exports = connectDB;
