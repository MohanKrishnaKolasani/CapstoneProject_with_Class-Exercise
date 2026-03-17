import * as artistService from "../../services/artistService";
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

describe("artistService", () => {
  test("getArtists() calls GET /artists", () => {
    API.get.mockResolvedValue({ data: [] });
    artistService.getArtists();
    expect(API.get).toHaveBeenCalledWith("/artists");
  });

  test("addArtist() posts to /artists with multipart header", () => {
    API.post.mockResolvedValue({ data: {} });
    const data = new FormData();
    artistService.addArtist(data);
    expect(API.post).toHaveBeenCalledWith(
      "/artists",
      data,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
  });

  test("updateArtist() puts to /artists/:id", () => {
    API.put.mockResolvedValue({ data: {} });
    artistService.updateArtist("a1", { artistName: "Sonu Nigam" });
    expect(API.put).toHaveBeenCalledWith("/artists/a1", { artistName: "Sonu Nigam" });
  });

  test("updateArtistPhoto() patches /artists/:id/photo with multipart header", () => {
    API.patch.mockResolvedValue({ data: {} });
    const formData = new FormData();
    artistService.updateArtistPhoto("a1", formData);
    expect(API.patch).toHaveBeenCalledWith(
      "/artists/a1/photo",
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
  });

  test("deleteArtist() sends DELETE to /artists/:id", () => {
    API.delete.mockResolvedValue({});
    artistService.deleteArtist("a1");
    expect(API.delete).toHaveBeenCalledWith("/artists/a1");
  });
});