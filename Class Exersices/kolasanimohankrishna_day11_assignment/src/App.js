import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./Home";
import BookDetails from "./BookDetails";
import Admin from "./Admin";
import "./App.css";
import storeObject from "./BookStore";

function App() {
  return (
    <Router>
      <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm mb-3">
        <div className="container">
          <Link to="/home" className="navbar-brand">
            Book Verse
          </Link>

          <div>
            <Link to="/home" className="btn btn-outline-primary me-2">
              Home
            </Link>
            <Link to="/admin" className="btn btn-outline-success">
              Admin
            </Link>
          </div>
        </div>
      </nav>

      <Routes>
        <Route path="/home" element={<Home store={storeObject} />} />
        <Route path="/book/:id" element={<BookDetails />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="*" element={<Home store={storeObject} />} />
      </Routes>
    </Router>
  );
}

export default App;