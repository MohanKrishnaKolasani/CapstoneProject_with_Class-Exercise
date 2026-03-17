import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import Register from "../../pages/auth/Register";
import * as authService from "../../services/authService";

jest.mock("../../services/authService");

jest.mock("react-router-dom");

function renderRegister() {
  return render(
    <MemoryRouter>
      <Register />
    </MemoryRouter>
  );
}

describe("Register component", () => {
  beforeEach(() => jest.clearAllMocks());

  describe("rendering", () => {
    test("renders the Create Account heading", () => {
      renderRegister();
      expect(screen.getByText("Create Account")).toBeInTheDocument();
    });

    test("renders full name input", () => {
      renderRegister();
      expect(screen.getByPlaceholderText(/enter your full name/i)).toBeInTheDocument();
    });

    test("renders email input", () => {
      renderRegister();
      expect(screen.getByPlaceholderText("name@example.com")).toBeInTheDocument();
    });

    test("renders phone input", () => {
      renderRegister();
      expect(screen.getByPlaceholderText(/10.15 digit/i)).toBeInTheDocument();
    });

    test("renders password input", () => {
      renderRegister();
      expect(screen.getByPlaceholderText(/at least 6 characters/i)).toBeInTheDocument();
    });

    test("renders the Register button", () => {
      renderRegister();
      expect(screen.getByRole("button", { name: /register/i })).toBeInTheDocument();
    });

    test("renders a Sign in link back to login", () => {
      renderRegister();
      expect(screen.getByRole("link", { name: /sign in/i })).toBeInTheDocument();
    });
  });

  describe("validation errors on empty submit", () => {
    test("shows all 4 required field errors", async () => {
      renderRegister();
      fireEvent.click(screen.getByRole("button", { name: /register/i }));
      await waitFor(() => {
        expect(screen.getByText(/full name is required/i)).toBeInTheDocument();
        expect(screen.getByText(/email address is required/i)).toBeInTheDocument();
        expect(screen.getByText(/phone number is required/i)).toBeInTheDocument();
        expect(screen.getByText(/password is required/i)).toBeInTheDocument();
      });
    });
  });

  describe("inline validation on blur", () => {
    test("shows invalid email error", async () => {
      renderRegister();
      const emailInput = screen.getByPlaceholderText("name@example.com");
      await userEvent.type(emailInput, "bademail");
      fireEvent.blur(emailInput);
      await waitFor(() =>
        expect(screen.getByText(/valid email address/i)).toBeInTheDocument()
      );
    });

    test("shows phone error for letters", async () => {
      renderRegister();
      const phoneInput = screen.getByPlaceholderText(/10.15 digit/i);
      await userEvent.type(phoneInput, "abcdefghij");
      fireEvent.blur(phoneInput);
      await waitFor(() =>
        expect(screen.getByText(/10/i)).toBeInTheDocument()
      );
    });

    test("shows phone error for fewer than 10 digits", async () => {
      renderRegister();
      const phoneInput = screen.getByPlaceholderText(/10.15 digit/i);
      await userEvent.type(phoneInput, "12345");
      fireEvent.blur(phoneInput);
      await waitFor(() =>
        expect(screen.getByText(/10/i)).toBeInTheDocument()
      );
    });

    test("shows short password error", async () => {
      renderRegister();
      const pwInput = screen.getByPlaceholderText(/at least 6 characters/i);
      await userEvent.type(pwInput, "abc");
      fireEvent.blur(pwInput);
      await waitFor(() =>
        expect(screen.getByText(/at least 6 characters/i)).toBeInTheDocument()
      );
    });

    test("clears email error when corrected", async () => {
      renderRegister();
      const emailInput = screen.getByPlaceholderText("name@example.com");
      await userEvent.type(emailInput, "bad");
      fireEvent.blur(emailInput);
      await waitFor(() =>
        expect(screen.getByText(/valid email address/i)).toBeInTheDocument()
      );
      await userEvent.clear(emailInput);
      await userEvent.type(emailInput, "good@email.com");
      await waitFor(() =>
        expect(screen.queryByText(/valid email address/i)).not.toBeInTheDocument()
      );
    });
  });

  describe("API calls", () => {
    async function fillAndSubmit() {
      await userEvent.type(screen.getByPlaceholderText(/enter your full name/i), "John Doe");
      await userEvent.type(screen.getByPlaceholderText("name@example.com"), "john@music.com");
      await userEvent.type(screen.getByPlaceholderText(/10.15 digit/i), "9876543210");
      await userEvent.type(screen.getByPlaceholderText(/at least 6 characters/i), "pass123");
      fireEvent.click(screen.getByRole("button", { name: /register/i }));
    }

    test("calls registerUser with correct data on valid submit", async () => {
      authService.registerUser.mockResolvedValue({ data: {} });
      renderRegister();
      await fillAndSubmit();
      await waitFor(() =>
        expect(authService.registerUser).toHaveBeenCalledWith({
          name:     "John Doe",
          email:    "john@music.com",
          phone:    "9876543210",
          password: "pass123",
        })
      );
    });

    test("shows success message after successful registration", async () => {
      authService.registerUser.mockResolvedValue({ data: {} });
      renderRegister();
      await fillAndSubmit();
      await waitFor(() =>
        expect(screen.getByText(/registration successful/i)).toBeInTheDocument()
      );
    });

    test("shows API error message when registration fails", async () => {
      authService.registerUser.mockRejectedValue({
        response: { data: { message: "Email already registered." } },
      });
      renderRegister();
      await fillAndSubmit();
      await waitFor(() =>
        expect(screen.getByText(/email already registered/i)).toBeInTheDocument()
      );
    });

    test("shows fallback error when API gives no message", async () => {
      authService.registerUser.mockRejectedValue(new Error("Network error"));
      renderRegister();
      await fillAndSubmit();
      await waitFor(() =>
        expect(screen.getByText(/registration failed/i)).toBeInTheDocument()
      );
    });
  });
});