const express = require("express");

const courseRoutes = require("./routes/courses");
const limiter = require("./middleware/limiter");
const errorMiddleware = require("./middleware/errorMiddleware");

const app = express();

app.use(express.json());

// rate limiter
app.use(limiter);

// API versioning
app.use("/api/v1/courses", courseRoutes);

// error handler
app.use(errorMiddleware);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});