import * as userService from "../../services/userService";
import API from "../../api/axiosConfig";

jest.mock("../../api/axiosConfig", () => ({
  get:    jest.fn(),
  post:   jest.fn(),
  put:    jest.fn(),
  delete: jest.fn(),
  patch:  jest.fn(),
  interceptors: { request: { use: jest.fn() } },
}));

beforeEach(() => jest.clearAllMocks());

describe("userService", () => {
  test("getUsers() calls GET /auth/users", () => {
    API.get.mockResolvedValue({ data: [] });
    userService.getUsers();
    expect(API.get).toHaveBeenCalledWith("/auth/users");
  });

  test("updateUser() puts to /auth/users/:id", () => {
    API.put.mockResolvedValue({ data: {} });
    userService.updateUser("u1", { name: "Updated Name" });
    expect(API.put).toHaveBeenCalledWith("/auth/users/u1", { name: "Updated Name" });
  });

  test("deleteUser() sends DELETE to /auth/users/:id", () => {
    API.delete.mockResolvedValue({});
    userService.deleteUser("u1");
    expect(API.delete).toHaveBeenCalledWith("/auth/users/u1");
  });
});