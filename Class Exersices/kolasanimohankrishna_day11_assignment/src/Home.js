import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Home({ store }) {
    const [books, setBooks] = useState([]);

    useEffect(() => {
        if (store.getAllBooks().length === 0) {
            fetch("http://localhost:3003/books")
                .then((res) => res.json())
                .then((data) => {
                    store.setInitialBooks(data);
                });
        }

        const updateBooks = () => {
            setBooks([...store.getAllBooks()]);
        };

        setBooks(store.getAllBooks());
        store.subscribe(updateBooks);

        return () => {
            store.unsubscribe(updateBooks);
        };
    }, [store]);

    return (
        <div className="container">
            <div className="row">
                {books.map((book) => (
                    <div key={book.id} className="col-md-4 mb-4">
                        <div className="card h-100 shadow-sm">
                            <div className="card-body"   id = "top3">
                                <h5>{book.title}</h5>
                                <p><strong>Author:</strong> {book.author}</p>
                                <p><strong>Price:</strong> Rs {book.price}</p>
                                <Link to={`/book/${book.id}`} className="btn btn-info">
                                    View Details
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Home;