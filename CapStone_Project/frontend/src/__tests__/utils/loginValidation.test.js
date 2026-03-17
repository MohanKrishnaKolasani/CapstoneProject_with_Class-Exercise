const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate({ email, password }) {
  const errors = {};
  if (!email.trim())                        errors.email    = "Email address is required.";
  else if (!EMAIL_REGEX.test(email.trim())) errors.email    = "Enter a valid email address.";
  if (!password)                            errors.password = "Password is required.";
  else if (password.length < 6)            errors.password = "Password must be at least 6 characters.";
  return errors;
}

describe("Login – validate()", () => {
  describe("email field", () => {
    test("returns error when email is empty", () => {
      const errors = validate({ email: "", password: "valid123" });
      expect(errors.email).toBe("Email address is required.");
    });

    test("returns error when email is only whitespace", () => {
      const errors = validate({ email: "   ", password: "valid123" });
      expect(errors.email).toBe("Email address is required.");
    });

    test("returns error for email missing @ symbol", () => {
      const errors = validate({ email: "notanemail", password: "valid123" });
      expect(errors.email).toBe("Enter a valid email address.");
    });

    test("returns error for email missing domain", () => {
      const errors = validate({ email: "user@", password: "valid123" });
      expect(errors.email).toBe("Enter a valid email address.");
    });

    test("returns error for email missing TLD", () => {
      const errors = validate({ email: "user@domain", password: "valid123" });
      expect(errors.email).toBe("Enter a valid email address.");
    });

    test("no email error for a valid email address", () => {
      const errors = validate({ email: "user@example.com", password: "valid123" });
      expect(errors.email).toBeUndefined();
    });

    test("trims whitespace before validating email", () => {
      const errors = validate({ email: "  user@example.com  ", password: "valid123" });
      expect(errors.email).toBeUndefined();
    });
  });

  describe("password field", () => {
    test("returns error when password is empty string", () => {
      const errors = validate({ email: "user@example.com", password: "" });
      expect(errors.password).toBe("Password is required.");
    });

    test("returns error when password is fewer than 6 characters", () => {
      const errors = validate({ email: "user@example.com", password: "abc" });
      expect(errors.password).toBe("Password must be at least 6 characters.");
    });

    test("returns error when password is exactly 5 characters", () => {
      const errors = validate({ email: "user@example.com", password: "abcde" });
      expect(errors.password).toBe("Password must be at least 6 characters.");
    });

    test("no password error when password is exactly 6 characters", () => {
      const errors = validate({ email: "user@example.com", password: "abcdef" });
      expect(errors.password).toBeUndefined();
    });

    test("no password error for a long valid password", () => {
      const errors = validate({ email: "user@example.com", password: "MySecurePass123!" });
      expect(errors.password).toBeUndefined();
    });
  });

  describe("combined validation", () => {
    test("returns both errors when both fields are empty", () => {
      const errors = validate({ email: "", password: "" });
      expect(errors.email).toBeDefined();
      expect(errors.password).toBeDefined();
    });

    test("returns empty object for fully valid inputs", () => {
      const errors = validate({ email: "admin@music.com", password: "Admin@1234" });
      expect(Object.keys(errors)).toHaveLength(0);
    });
  });
});