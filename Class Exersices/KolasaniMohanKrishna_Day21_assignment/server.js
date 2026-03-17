const express = require("express");
const path = require("path");

const logger = require("./utils/logger");
const courseRoutes = require("./controllers/courses");
const userRoutes = require("./controllers/users");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(logger);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use("/courses", courseRoutes);
app.use("/users", userRoutes);

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});