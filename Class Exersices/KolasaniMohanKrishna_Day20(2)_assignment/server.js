const express = require("express");
const app = express();
const courseRoute = require("./routes/courses");

// Root route
app.get("/", (req, res) => {
    res.send("Welcome to SkillSphere LMS API");
});

app.use("/courses", courseRoute);

app.listen(4000, () => {
    console.log("Server running on port 4000");
});