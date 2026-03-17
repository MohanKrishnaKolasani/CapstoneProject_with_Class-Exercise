const connection = require("../config/mysql");

const course = {
  course_name: "MERN Stack Development",
  instructor: "Mohan Krishna",
  duration: "5 weeks"
};

const query = "INSERT INTO courses (course_name, instructor, duration) VALUES (?, ?, ?)";

connection.query(
  query,
  [course.course_name, course.instructor, course.duration],
  (err, result) => {
    if (err) {
      console.log("Insert Error:", err);
    } else {
      console.log("Course inserted successfully");
    }
    connection.end();
  }
);