const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[0-9]{10,15}$/;

function validate({ name, email, phone, password }) {
  const errors = {};
  if (!name.trim())
    errors.name = "Full name is required.";
  else if (name.trim().length < 2)
    errors.name = "Name must be at least 2 characters.";

  if (!email.trim())
    errors.email = "Email address is required.";
  else if (!EMAIL_REGEX.test(email.trim()))
    errors.email = "Enter a valid email address (e.g. user@example.com).";

  if (!phone.trim())
    errors.phone = "Phone number is required.";
  else if (!PHONE_REGEX.test(phone.trim()))
    errors.phone = "Phone must be 10–15 digits with no spaces or symbols.";

  if (!password)
    errors.password = "Password is required.";
  else if (password.length < 6)
    errors.password = "Password must be at least 6 characters.";

  return errors;
}

describe("Register – validate()", () => {
  describe("name field", () => {
    test("returns error when name is empty", () => {
      const errors = validate({ name: "", email: "a@b.com", phone: "9876543210", password: "pass123" });
      expect(errors.name).toBe("Full name is required.");
    });

    test("returns error when name is only whitespace", () => {
      const errors = validate({ name: "   ", email: "a@b.com", phone: "9876543210", password: "pass123" });
      expect(errors.name).toBe("Full name is required.");
    });

    test("returns error when name is a single character", () => {
      const errors = validate({ name: "A", email: "a@b.com", phone: "9876543210", password: "pass123" });
      expect(errors.name).toBe("Name must be at least 2 characters.");
    });

    test("no error when name has 2 or more characters", () => {
      const errors = validate({ name: "Al", email: "a@b.com", phone: "9876543210", password: "pass123" });
      expect(errors.name).toBeUndefined();
    });

    test("no error for a full valid name", () => {
      const errors = validate({ name: "John Doe", email: "a@b.com", phone: "9876543210", password: "pass123" });
      expect(errors.name).toBeUndefined();
    });
  });

  describe("email field", () => {
    test("returns error when email is empty", () => {
      const errors = validate({ name: "John", email: "", phone: "9876543210", password: "pass123" });
      expect(errors.email).toBe("Email address is required.");
    });

    test("returns error for invalid email format", () => {
      const errors = validate({ name: "John", email: "bademail", phone: "9876543210", password: "pass123" });
      expect(errors.email).toContain("valid email address");
    });

    test("no error for a valid email", () => {
      const errors = validate({ name: "John", email: "john@example.com", phone: "9876543210", password: "pass123" });
      expect(errors.email).toBeUndefined();
    });
  });

  describe("phone field", () => {
    test("returns error when phone is empty", () => {
      const errors = validate({ name: "John", email: "a@b.com", phone: "", password: "pass123" });
      expect(errors.phone).toBe("Phone number is required.");
    });

    test("returns error when phone contains letters", () => {
      const errors = validate({ name: "John", email: "a@b.com", phone: "abcde12345", password: "pass123" });
      expect(errors.phone).toContain("10");
    });

    test("returns error when phone is fewer than 10 digits", () => {
      const errors = validate({ name: "John", email: "a@b.com", phone: "12345", password: "pass123" });
      expect(errors.phone).toBeDefined();
    });

    test("returns error when phone has more than 15 digits", () => {
      const errors = validate({ name: "John", email: "a@b.com", phone: "1234567890123456", password: "pass123" });
      expect(errors.phone).toBeDefined();
    });

    test("no error for a valid 10-digit phone number", () => {
      const errors = validate({ name: "John", email: "a@b.com", phone: "9876543210", password: "pass123" });
      expect(errors.phone).toBeUndefined();
    });

    test("no error for a valid 15-digit phone number", () => {
      const errors = validate({ name: "John", email: "a@b.com", phone: "123456789012345", password: "pass123" });
      expect(errors.phone).toBeUndefined();
    });
  });

  describe("password field", () => {
    test("returns error when password is empty", () => {
      const errors = validate({ name: "John", email: "a@b.com", phone: "9876543210", password: "" });
      expect(errors.password).toBe("Password is required.");
    });

    test("returns error when password is fewer than 6 characters", () => {
      const errors = validate({ name: "John", email: "a@b.com", phone: "9876543210", password: "abc" });
      expect(errors.password).toBe("Password must be at least 6 characters.");
    });

    test("no error when password is exactly 6 characters", () => {
      const errors = validate({ name: "John", email: "a@b.com", phone: "9876543210", password: "abc123" });
      expect(errors.password).toBeUndefined();
    });
  });

  describe("combined validation", () => {
    test("returns all 4 errors when form is completely empty", () => {
      const errors = validate({ name: "", email: "", phone: "", password: "" });
      expect(errors.name).toBeDefined();
      expect(errors.email).toBeDefined();
      expect(errors.phone).toBeDefined();
      expect(errors.password).toBeDefined();
    });

    test("returns empty object for a completely valid form", () => {
      const errors = validate({
        name:     "Jane Doe",
        email:    "jane@music.com",
        phone:    "9876543210",
        password: "SecurePass1",
      });
      expect(Object.keys(errors)).toHaveLength(0);
    });
  });
});