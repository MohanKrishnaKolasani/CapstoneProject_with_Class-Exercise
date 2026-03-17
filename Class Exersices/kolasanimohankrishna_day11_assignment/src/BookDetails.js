import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function BookDetails() {
  const { id } = useParams();
  const [book, setBook] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:3003/books/${id}`)
      .then((res) => res.json())
      .then((data) => setBook(data));
  }, [id]);

  if (!book) return <p className="text-center">Loading...</p>;

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow-sm">
            <div className="card-body"   id = "top3">
              <h3>{book.title }</h3>
              <p><strong>Author:</strong> {book.author}</p>
              <p><strong>Price:</strong> Rs {book.price}</p>
              <p><strong>Bio:</strong> {book.bio}</p>

              <h5 className="mt-3">Top Books</h5>
              <ul className="list-group">
                {book.topBooks?.map((b, index) => (
                  <li key={index} className="list-group-item">
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookDetails;