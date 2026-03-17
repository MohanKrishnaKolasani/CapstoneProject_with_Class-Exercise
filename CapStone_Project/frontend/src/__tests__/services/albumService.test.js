import * as albumService from "../../services/albumService";
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

describe("albumService", () => {
  test("getAlbums() calls GET /albums", () => {
    API.get.mockResolvedValue({ data: [] });
    albumService.getAlbums();
    expect(API.get).toHaveBeenCalledWith("/albums");
  });

  test("addAlbum() posts to /albums with form data", () => {
    API.post.mockResolvedValue({ data: {} });
    const formData = new FormData();
    albumService.addAlbum(formData);
    expect(API.post).toHaveBeenCalledWith("/albums", formData);
  });

  test("updateAlbum() puts to /albums/:id", () => {
    API.put.mockResolvedValue({ data: {} });
    const fd = new FormData();
    albumService.updateAlbum("al1", fd);
    expect(API.put).toHaveBeenCalledWith("/albums/al1", fd);
  });

  test("deleteAlbum() sends DELETE to /albums/:id", () => {
    API.delete.mockResolvedValue({});
    albumService.deleteAlbum("al1");
    expect(API.delete).toHaveBeenCalledWith("/albums/al1");
  });
});