import React, { Component, createRef } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./Home";
import BookDetails from "./BookDetails";
import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);
    this.searchInputRef = createRef();
  }

  focusInput = () => {
    this.searchInputRef.current.focus();
  };

  render() {
    return (
      <Router>
        <div className="app">
          <nav className="navbar">
            <Link to="/home" className="btn btn-secondary">
              Home
            </Link>
          </nav>

          <Routes>
            <Route path="/home" element={<Home searchRef={this.searchInputRef} />} />
            <Route path="/book/:id" element={<BookDetails />} />
            <Route path="*" element={<Home searchRef={this.searchInputRef} />} />
          </Routes>
        </div>
      </Router>
    );
  }
}

export default App;