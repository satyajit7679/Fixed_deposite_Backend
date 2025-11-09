
const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  try {
    console.log("MongoDB URL:", process.env.MONGO_DB_URL); // Debug line
    await mongoose.connect(process.env.MONGO_DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.error("❌ MongoDB Connection Failed:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;

