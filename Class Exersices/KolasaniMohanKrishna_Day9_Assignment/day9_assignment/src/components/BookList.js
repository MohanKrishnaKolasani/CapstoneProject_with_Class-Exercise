import React, { useState } from "react";
import BookCard from "./BookCard";

function BookList({ onAuthorSelect, searchRef }) {
  const [viewMode, setViewMode] = useState("grid");
  const [searchTerm, setSearchTerm] = useState("");

  const books = [
    {
      id: 1,
      title: "The White Tiger",
      author: "Aravind Adiga",
      price: 350,
      bio: "Indian writer and Booker Prize winner.",
      topBooks: ["The White Tiger", "Last Man in Tower", "Selection Day"]
    },
    {
      id: 2,
      title: "Malgudi Days",
      author: "R. K. Narayan",
      price: 250,
      bio: "Famous Indian writer known for Malgudi stories.",
      topBooks: ["Malgudi Days", "The Guide", "Swami and Friends"]
    },
    {
      id: 3,
      title: "Five Point Someone",
      author: "Chetan Bhagat",
      price: 299,
      bio: "Indian author known for youth novels.",
      topBooks: ["Five Point Someone", "2 States", "Half Girlfriend"]
    }
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
        ref={searchRef}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="form-control mb-2"
      />

      <div style={{ margin: "10px 0" }}>
        <button className="btn btn-primary me-2" onClick={() => setViewMode("grid")}>
          Grid View
        </button>
        <button className="btn btn-dark" onClick={() => setViewMode("list")}>
          List View
        </button>
      </div>

      <div className={viewMode === "grid" ? "grid-container" : "list-container"}>
        {filteredBooks.map((book) => (
          <BookCard
            key={book.id}
            title={book.title}
            author={book.author}
            price={book.price}
            viewMode={viewMode}
            onClick={() => onAuthorSelect(book)}
          />
        ))}
      </div>
    </div>
  );
}

export default BookList;