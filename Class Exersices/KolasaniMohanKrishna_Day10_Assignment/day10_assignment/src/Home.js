import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import withLoader from "./withLoader";
import Greeting from "./Greeting";

function Home({ isLoading, setLoading }) {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    setLoading(true);

    fetch("http://localhost:3003/books")
      .then((res) => res.json())
      .then((data) => {
        setBooks(data);
        setLoading(false);
      });
  }, [setLoading]);

  if (isLoading) return null;

  return (
    <div className="book-grid">
  {books.map((book) => (
    <div key={book.id} className="card fade-in">
      <h4>{book.title}</h4>
      <p><strong>Author:</strong> {book.author}</p>
      <p><strong>Price:</strong> Rs {book.price}</p>
      <Link to={`/book/${book.id}`} className=" btn btn-info">
        View Details
      </Link>
    </div>
  ))}
</div>
  );
}

export default withLoader(Home);