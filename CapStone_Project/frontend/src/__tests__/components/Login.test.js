import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import Login from "../../pages/auth/Login";
import * as authService from "../../services/authService";

jest.mock("../../services/authService");

jest.mock("react-router-dom");

const mockLogin = jest.fn();
const mockAuthContext = {
  user:            null,
  token:           null,
  role:            null,
  isAuthenticated: false,
  isAdmin:         false,
  loading:         false,
  login:           mockLogin,
  logout:          jest.fn(),
};

function renderLogin(ctxOverrides = {}) {
  return render(
    <MemoryRouter>
      <AuthContext.Provider value={{ ...mockAuthContext, ...ctxOverrides }}>
        <Login />
      </AuthContext.Provider>
    </MemoryRouter>
  );
}

describe("Login component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  describe("rendering", () => {
    test("renders the Music Library heading", () => {
      renderLogin();
      expect(screen.getByText("Music Library")).toBeInTheDocument();
    });

    test("renders email input", () => {
      renderLogin();
      expect(screen.getByPlaceholderText("name@example.com")).toBeInTheDocument();
    });

    test("renders password input", () => {
      renderLogin();
      expect(screen.getByPlaceholderText("••••••••")).toBeInTheDocument();
    });

    test("renders the Sign In button", () => {
      renderLogin();
      expect(screen.getByRole("button", { name: /sign in/i })).toBeInTheDocument();
    });

    test("renders a link to the register page", () => {
      renderLogin();
      expect(screen.getByText(/create an account/i)).toBeInTheDocument();
    });
  });

  describe("validation errors on empty submit", () => {
    test("shows email required error", async () => {
      renderLogin();
      fireEvent.click(screen.getByRole("button", { name: /sign in/i }));
      await waitFor(() =>
        expect(screen.getByText(/email address is required/i)).toBeInTheDocument()
      );
    });

    test("shows password required error", async () => {
      renderLogin();
      fireEvent.click(screen.getByRole("button", { name: /sign in/i }));
      await waitFor(() =>
        expect(screen.getByText(/password is required/i)).toBeInTheDocument()
      );
    });
  });

  describe("inline validation on blur", () => {
    test("shows invalid email error after typing a bad email and blurring", async () => {
      renderLogin();
      const emailInput = screen.getByPlaceholderText("name@example.com");
      await userEvent.type(emailInput, "bademail");
      fireEvent.blur(emailInput);
      await waitFor(() =>
        expect(screen.getByText(/enter a valid email address/i)).toBeInTheDocument()
      );
    });

    test("shows short password error after typing < 6 chars and blurring", async () => {
      renderLogin();
      const pwInput = screen.getByPlaceholderText("••••••••");
      await userEvent.type(pwInput, "abc");
      fireEvent.blur(pwInput);
      await waitFor(() =>
        expect(screen.getByText(/at least 6 characters/i)).toBeInTheDocument()
      );
    });
  });

  describe("API calls", () => {
    test("calls loginUser with correct credentials on valid submit", async () => {
      authService.loginUser.mockResolvedValue({
        data: { token: "tok123", user: { role: "user" } },
      });
      renderLogin();
      await userEvent.type(screen.getByPlaceholderText("name@example.com"), "user@music.com");
      await userEvent.type(screen.getByPlaceholderText("••••••••"), "password123");
      fireEvent.click(screen.getByRole("button", { name: /sign in/i }));
      await waitFor(() =>
        expect(authService.loginUser).toHaveBeenCalledWith({
          email:    "user@music.com",
          password: "password123",
        })
      );
    });

    test("calls context login() with token and role on successful login", async () => {
      authService.loginUser.mockResolvedValue({
        data: { token: "tok123", user: { role: "user" } },
      });
      renderLogin();
      await userEvent.type(screen.getByPlaceholderText("name@example.com"), "user@music.com");
      await userEvent.type(screen.getByPlaceholderText("••••••••"), "password123");
      fireEvent.click(screen.getByRole("button", { name: /sign in/i }));
      await waitFor(() =>
        expect(mockLogin).toHaveBeenCalledWith("tok123", "user")
      );
    });

    test("shows API error message when login fails", async () => {
      authService.loginUser.mockRejectedValue({
        response: { data: { message: "Invalid credentials. Please try again." } },
      });
      renderLogin();
      await userEvent.type(screen.getByPlaceholderText("name@example.com"), "wrong@music.com");
      await userEvent.type(screen.getByPlaceholderText("••••••••"), "wrongpass");
      fireEvent.click(screen.getByRole("button", { name: /sign in/i }));
      await waitFor(() =>
        expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument()
      );
    });

    test("shows loading state while request is pending", async () => {
      authService.loginUser.mockReturnValue(new Promise(() => {}));
      renderLogin();
      await userEvent.type(screen.getByPlaceholderText("name@example.com"), "user@music.com");
      await userEvent.type(screen.getByPlaceholderText("••••••••"), "password123");
      fireEvent.click(screen.getByRole("button", { name: /sign in/i }));
      await waitFor(() =>
        expect(screen.getByText(/signing in/i)).toBeInTheDocument()
      );
    });

    test("shows fallback error when API gives no message", async () => {
      authService.loginUser.mockRejectedValue(new Error("Network failure"));
      renderLogin();
      await userEvent.type(screen.getByPlaceholderText("name@example.com"), "u@music.com");
      await userEvent.type(screen.getByPlaceholderText("••••••••"), "password123");
      fireEvent.click(screen.getByRole("button", { name: /sign in/i }));
      await waitFor(() =>
        expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument()
      );
    });
  });
});