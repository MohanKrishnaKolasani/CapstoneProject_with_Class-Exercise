const mongoose = require("mongoose");

const enrollmentSchema = new mongoose.Schema({
  userId: String,
  courseId: String,
  enrolledDate: Date
});

module.exports = mongoose.model("Enrollment", enrollmentSchema);