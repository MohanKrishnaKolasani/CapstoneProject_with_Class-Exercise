const connectMongo = require("../config/mongo");
const User = require("../models/User");
const Enrollment = require("../models/Enrollment");

const run = async () => {

  await connectMongo();

  const user = await User.create({
    name: "Mohan",
    email: "mohan@gmail.com",
    role: "student"
  });

  await Enrollment.create({
    userId: user._id,
    courseId: "MERN Stack Development",
    enrolledDate: new Date()
  });

  const enrollments = await Enrollment.find();

  console.log("Enrollment Details:");

  enrollments.forEach(e => {
    console.log(`UserID: ${e.userId} Course: ${e.courseId}`);
  });

  process.exit();
};

run();