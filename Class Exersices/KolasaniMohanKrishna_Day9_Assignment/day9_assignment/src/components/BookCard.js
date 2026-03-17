import React, { Component } from "react";
import PropTypes from "prop-types";

class BookCard extends Component {

  componentDidMount() {
    console.log("BookCard Mounted");
  }

  render() {
    const { title, author, price, viewMode, onClick } = this.props;

    return (
      <div className={viewMode === "grid" ? "card-grid" : "card-list"}>
        <h3>{title}</h3>
        <p><strong>Author:</strong> {author}</p>
        <p><strong>Price:</strong> Rs: {price}/-</p>

        <button onClick={onClick}>
          View Author
        </button>
      </div>
    );
  }
}

BookCard.propTypes = {
  title: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  viewMode: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired
};

export default BookCard;