import React, { Component } from "react";

class AuthorInfo extends Component {

  componentDidMount() {
    console.log("AuthorInfo Component Loaded");
  }

  render() {
    const { author } = this.props;

    if (!author) {
      return <p className="mt-3">Click on a book to see author details.</p>;
    }

    return (
      <div className="card p-3 mt-4 bg-light">
        <h4>Author Name: {author.author}</h4>
        <p><strong>Bio:</strong> {author.bio}</p>

        <h5>Top 3 Books:</h5>
        <ul>
          {author.topBooks.map((book, index) => (
            <li key={index}>{book}</li>
          ))}
        </ul>
      </div>
    );
  }
}

export default AuthorInfo;