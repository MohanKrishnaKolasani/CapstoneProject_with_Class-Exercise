const sequelize = require("../config/sequelize");
const Instructor = require("../models/Instructor");
const Course = require("../models/Course");

Instructor.hasMany(Course);
Course.belongsTo(Instructor);

const run = async () => {

  await sequelize.sync();

  const instructor = await Instructor.create({
    name: "sathish",
    email: "sathish@gmail.com"
  });

  await Course.create({
    title: "MERN Stack Development",
    InstructorId: instructor.id
  });

  await Course.create({
    title: "Express.js",
    InstructorId: instructor.id
  });

  const courses = await Course.findAll({
    where: { InstructorId: instructor.id }
  });

  console.log(`Instructor: ${instructor.name}`);
  console.log("Courses:");

  courses.forEach(course => {
    console.log(course.title);
  });

  process.exit();
};

run();