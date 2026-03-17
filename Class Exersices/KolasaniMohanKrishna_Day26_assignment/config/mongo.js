const mongoose = require("mongoose");
require("dotenv").config();

const connectMongo = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected");
  } catch (error) {
    console.log("MongoDB Connection Error:", error);
  }
};

module.exports = connectMongo;