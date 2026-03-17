const express = require("express");
const router = express.Router();

const checkAdmin = require("../middleware/auth");

router.get("/", checkAdmin, (req, res) => {
  res.render("admin");
});

module.exports = router;