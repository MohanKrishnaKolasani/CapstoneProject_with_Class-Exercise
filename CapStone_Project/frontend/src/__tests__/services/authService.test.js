import * as authService from "../../services/authService";
import API from "../../api/axiosConfig";

jest.mock("../../api/axiosConfig", () => ({
  get:  jest.fn(),
  post: jest.fn(),
  put:  jest.fn(),
  delete: jest.fn(),
  patch: jest.fn(),
  interceptors: { request: { use: jest.fn() } },
}));

describe("authService", () => {
  beforeEach(() => jest.clearAllMocks());

  test("loginUser() posts to /auth/login with provided credentials", () => {
    const credentials = { email: "user@test.com", password: "pass123" };
    API.post.mockResolvedValue({ data: { token: "tok" } });
    authService.loginUser(credentials);
    expect(API.post).toHaveBeenCalledWith("/auth/login", credentials);
  });

  test("registerUser() posts to /auth/register with provided data", () => {
    const data = { name: "John", email: "john@test.com", phone: "9876543210", password: "pass123" };
    API.post.mockResolvedValue({ data: {} });
    authService.registerUser(data);
    expect(API.post).toHaveBeenCalledWith("/auth/register", data);
  });

  test("getProfile() sends GET to /auth/profile", () => {
    API.get.mockResolvedValue({ data: { name: "John" } });
    authService.getProfile();
    expect(API.get).toHaveBeenCalledWith("/auth/profile");
  });

  test("uploadProfilePicture() posts to /auth/profile-picture", () => {
    const formData = new FormData();
    API.post.mockResolvedValue({ data: {} });
    authService.uploadProfilePicture(formData);
    expect(API.post).toHaveBeenCalledWith("/auth/profile-picture", formData);
  });
});