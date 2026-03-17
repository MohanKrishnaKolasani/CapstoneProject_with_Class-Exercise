import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import withLoader from "./withLoader";

function BookDetails({ isLoading, setLoading }) {
    const { id } = useParams();
    const [book, setBook] = useState(null);

    useEffect(() => {
        setLoading(true);

        fetch(`http://localhost:3003/books/${id}`)
            .then((res) => res.json())
            .then((data) => {
                setBook(data);
                setLoading(false);
            });
    }, [id, setLoading]);

    if (isLoading || !book) return null;

    return (
        <div className="fade-in" style={{ display: 'flex', justifyContent: 'center', paddingTop: '20px' }}>
            <div className="card">
                <h2>{book.title}</h2>
                <p><strong>Author:</strong> {book.author}</p>
                <p><strong>Price:</strong> Rs {book.price}</p>
                <p><strong>Bio:</strong> {book.bio}</p>

                <h4>Top Books:</h4>
                <ul>
                    {book.topBooks.map((b, index) => (
                        <li key={index}>{b}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default withLoader(BookDetails);