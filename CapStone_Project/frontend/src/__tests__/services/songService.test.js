import * as songService from "../../services/songService";
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

describe("songService", () => {
  test("getSongs() calls GET /songs", () => {
    API.get.mockResolvedValue({ data: [] });
    songService.getSongs();
    expect(API.get).toHaveBeenCalledWith("/songs");
  });

  test("getAllSongsAdmin() calls GET /songs/admin/all", () => {
    API.get.mockResolvedValue({ data: [] });
    songService.getAllSongsAdmin();
    expect(API.get).toHaveBeenCalledWith("/songs/admin/all");
  });

  test("getSongById() calls GET /songs/:id", () => {
    API.get.mockResolvedValue({ data: {} });
    songService.getSongById("abc123");
    expect(API.get).toHaveBeenCalledWith("/songs/abc123");
  });

  test("searchSongs() calls GET /songs with query params", () => {
    API.get.mockResolvedValue({ data: [] });
    const params = { search: "Jai Ho", artist: "AR Rahman" };
    songService.searchSongs(params);
    expect(API.get).toHaveBeenCalledWith("/songs", { params });
  });

  test("addSong() posts to /songs with provided data", () => {
    API.post.mockResolvedValue({ data: {} });
    const data = new FormData();
    songService.addSong(data);
    expect(API.post).toHaveBeenCalledWith("/songs", data);
  });

  test("updateSong() puts to /songs/:id with provided data", () => {
    API.put.mockResolvedValue({ data: {} });
    const data = { songName: "Updated Song" };
    songService.updateSong("song1", data);
    expect(API.put).toHaveBeenCalledWith("/songs/song1", data);
  });

  test("deleteSong() sends DELETE to /songs/:id", () => {
    API.delete.mockResolvedValue({ data: {} });
    songService.deleteSong("song1");
    expect(API.delete).toHaveBeenCalledWith("/songs/song1");
  });

  test("toggleVisibility() sends PATCH to /songs/:id/visibility", () => {
    API.patch.mockResolvedValue({ data: {} });
    songService.toggleVisibility("song1");
    expect(API.patch).toHaveBeenCalledWith("/songs/song1/visibility");
  });
});