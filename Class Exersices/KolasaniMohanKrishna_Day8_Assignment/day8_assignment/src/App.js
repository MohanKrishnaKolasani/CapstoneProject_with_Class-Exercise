import React from "react";
import BookList from "./components/BookList";
import "./App.css";

function App() {
  return (
    <div className="app">
      <h1>Welcome to BookVerse</h1>
      <p>Discover some of the most popular books selected for you.</p>
      <BookList />
    </div>
  );
}

export default App;