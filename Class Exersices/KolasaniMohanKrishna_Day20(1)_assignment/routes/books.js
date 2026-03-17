const express = require("express");

const router = express.Router();

let books = [
 { id: 1, title: "1984", author: "Orwell" },
 { id: 2, title: "The Alchemist", author: "Coelho" }
];

router.get("/", (req, res) => {
    res.json(books);
});

router.post("/", (req, res) => {

    const { id, title, author } = req.body;

    if (!title || !author) {
        return res.status(400).json({ message: "Title and author required" });
    }

    const newBook = { id, title, author };

    books.push(newBook);

    res.json(books);
});

router.put("/:id", (req, res) => {

    const id = parseInt(req.params.id);

    books = books.map(book =>
        book.id === id ? { ...book, ...req.body } : book
    );

    res.json(books);
});

router.delete("/:id", (req, res) => {

    const id = parseInt(req.params.id);

    books = books.filter(book => book.id !== id);

    res.json(books);
});

module.exports = router;