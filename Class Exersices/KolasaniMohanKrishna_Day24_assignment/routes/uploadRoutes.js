const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadMiddleware");

router.post("/upload", upload.single("file"), (req, res) => {
    if (!req.file) {
        return res.status(400).send("No file uploaded");
    }
    res.send(`File uploaded successfully: ${req.file.filename}`);
});
module.exports = router;