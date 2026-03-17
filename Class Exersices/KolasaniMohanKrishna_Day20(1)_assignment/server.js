const express = require("express");
const app = express();
const bookRouter = require("./routes/books");

app.use(express.json());
app.use((req, res, next) => {
    console.log(`[${req.method}] ${req.url}`);
    next();
});

app.get("/", (req, res) => {
    res.send("Welcome to Express Server");
});

app.get("/status", (req, res) => {
    res.json({ server: "running", uptime: "OK" });
});

app.get("/products", (req, res) => {
    const name = req.query.name;
    if (name) {
        res.send("Searching for product: " + name);
    } else {
        res.send("Please provide a product name");
    }

});

app.use("/books", bookRouter);

app.use((req, res) => {
    res.status(404).send("Route not found");
});

app.listen(4000, () => {
    console.log("Server running on port 4000");
});