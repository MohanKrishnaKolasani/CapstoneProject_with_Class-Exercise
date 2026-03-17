import React, { Component, createRef } from "react";
import BookList from "./components/BookList";
import AuthorInfo from "./components/AuthorInfo";
import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);

    this.searchInputRef = createRef();

    this.state = {
      selectedAuthor: null
    };
  }

  componentDidMount() {
    console.log("App Component Loaded");
  }

  focusInput = () => {
    this.searchInputRef.current.focus();
  };

  setAuthor = (authorData) => {
    this.setState({ selectedAuthor: authorData });
  };

  render() {
    return (
      <div className="app container mt-4">
        <h1>Welcome to BookVerse</h1>
        <p>Discover some of the most popular books selected for you.</p>

        <button className="btn btn-secondary mb-3" onClick={this.focusInput}>
          Focus Search
        </button>

        <BookList
          onAuthorSelect={this.setAuthor}
          searchRef={this.searchInputRef}
        />

        <AuthorInfo author={this.state.selectedAuthor} />
      </div>
    );
  }
}

export default App;