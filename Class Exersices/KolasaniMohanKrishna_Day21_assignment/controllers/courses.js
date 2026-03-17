const express = require("express");
const router = express.Router();

const courses = require("../models/courses");

router.get("/", (req, res) => {
  res.render("courses", { courses: courses });
});

module.exports = router;