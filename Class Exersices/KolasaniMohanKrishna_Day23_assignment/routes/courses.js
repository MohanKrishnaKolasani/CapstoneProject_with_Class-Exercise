const express = require("express");
const router = express.Router();

const courses = require("../data/courses");

const {
  courseValidationRules,
  validateCourse,
} = require("../validators/courseValidator");

// GET all courses
router.get("/", (req, res) => {
  res.json(courses);
});

// POST create course
router.post("/", courseValidationRules, validateCourse, (req, res) => {
  const { name, duration } = req.body;

  const newCourse = {
    id: courses.length + 1,
    name,
    duration,
  };

  courses.push(newCourse);

  res.json({
    message: "Course created successfully",
    course: newCourse,
  });
});

// PUT update course
router.put("/:id", (req, res) => {
  const course = courses.find((c) => c.id === parseInt(req.params.id));

  if (!course) {
    return res.status(404).json({ error: "Course not found" });
  }

  course.name = req.body.name || course.name;
  course.duration = req.body.duration || course.duration;

  res.json({
    message: "Course updated",
    course,
  });
});

// DELETE course
router.delete("/:id", (req, res) => {
  const index = courses.findIndex(
    (c) => c.id === parseInt(req.params.id)
  );

  if (index === -1) {
    return res.status(404).json({ error: "Course not found" });
  }

  const deleted = courses.splice(index, 1);

  res.json({
    message: "Course deleted",
    course: deleted[0],
  });
});

module.exports = router;