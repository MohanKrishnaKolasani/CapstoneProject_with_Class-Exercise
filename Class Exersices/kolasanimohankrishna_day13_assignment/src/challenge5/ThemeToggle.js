import React, { useContext } from "react";
import { ThemeContext } from "./ThemeContext";

function ThemeToggle() {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <div style={{ marginBottom: "20px" }}>
      <button onClick={toggleTheme} className="theme-btn">
        Switch to {theme === "light" ? "Dark" : "Light"} Mode
      </button>
    </div>
  );
}

export default ThemeToggle;