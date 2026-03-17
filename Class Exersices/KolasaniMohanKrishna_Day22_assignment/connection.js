const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/userAuthDB");

const con = mongoose.connection;

con.on("connected", () => {
    console.log("MongoDB connected successfully");
});

con.on("error", (err) => {
    console.log("MongoDB connection failed", err);
});

module.exports = mongoose;