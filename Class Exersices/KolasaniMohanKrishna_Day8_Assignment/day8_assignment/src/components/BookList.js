import React, { useState } from "react";
import BookCard from "./BookCard";

function BookList() {
  const [viewMode, setViewMode] = useState("grid");
  const [searchTerm, setSearchTerm] = useState("");

  const books = [
  { id: 1, title: "The White Tiger", author: "Aravind Adiga", price: 350 },
  { id: 2, title: "Malgudi Days", author: "R. K. Narayan", price: 250 },
  { id: 3, title: "The Guide", author: "R. K. Narayan", price: 300 },
  { id: 4, title: "Five Point Someone", author: "Chetan Bhagat", price: 299 },
  { id: 5, title: "Train to Pakistan", author: "Khushwant Singh", price: 360 }
];

  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h2>Featured Books</h2>

      <input
        type="text"
        placeholder="Search by title..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div style={{ margin: "10px 0" }}>
        <button onClick={() => setViewMode("grid")}>Grid View</button>
        <button onClick={() => setViewMode("list")}>List View</button>
      </div>

      <div className={viewMode === "grid" ? "grid-container" : "list-container"}>
        {filteredBooks.map((book) => (
          <BookCard
            key={book.id}
            title={book.title}
            author={book.author}
            price={book.price}
            viewMode={viewMode}
          />
        ))}
      </div>
    </div>
  );
}

export default BookList;