const express = require("express");
const router = express.Router();
function validateCourseId(req, res, next) {

    const id = req.params.id;

    if (isNaN(id)) {
        return res.json({ error: "Invalid course ID" });
    }
    next();
}
router.get("/:id", validateCourseId, (req, res) => {
    const id = req.params.id;
    res.json({
        id: id,
        name: "React Mastery",
        duration: "6 weeks"
    });
});

module.exports = router;