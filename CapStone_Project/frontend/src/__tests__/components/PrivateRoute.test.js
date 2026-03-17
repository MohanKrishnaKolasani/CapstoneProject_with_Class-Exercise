import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import PrivateRoute from "../../routes/PrivateRoute";
import { AuthContext } from "../../context/AuthContext";

function renderWithAuth(isAuthenticated, ui) {
  const contextValue = {
    isAuthenticated,
    user:    isAuthenticated ? { name: "Test User" } : null,
    token:   isAuthenticated ? "mock-token" : null,
    role:    "user",
    loading: false,
    login:   jest.fn(),
    logout:  jest.fn(),
  };

  return render(
    <AuthContext.Provider value={contextValue}>
      <MemoryRouter initialEntries={["/protected"]}>
        <Routes>
          <Route path="/login" element={<div>Login Page</div>} />
          <Route
            path="/protected"
            element={<PrivateRoute>{ui}</PrivateRoute>}
          />
        </Routes>
      </MemoryRouter>
    </AuthContext.Provider>
  );
}

describe("PrivateRoute component", () => {
  test("redirects unauthenticated user to /login", () => {
    renderWithAuth(false, <div>Protected Content</div>);
    expect(screen.getByText("Login Page")).toBeInTheDocument();
    expect(screen.queryByText("Protected Content")).not.toBeInTheDocument();
  });

  test("renders protected children for authenticated user", () => {
    renderWithAuth(true, <div>Protected Content</div>);
    expect(screen.getByText("Protected Content")).toBeInTheDocument();
    expect(screen.queryByText("Login Page")).not.toBeInTheDocument();
  });

  test("renders complex children for authenticated user", () => {
    renderWithAuth(true, (
      <div>
        <h1>Dashboard</h1>
        <p>Welcome back</p>
      </div>
    ));
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Welcome back")).toBeInTheDocument();
  });
});