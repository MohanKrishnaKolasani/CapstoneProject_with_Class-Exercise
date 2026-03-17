import * as playlistService from "../../services/playlistService";
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

describe("playlistService", () => {
  test("getPlaylists() calls GET /playlists", () => {
    API.get.mockResolvedValue({ data: [] });
    playlistService.getPlaylists();
    expect(API.get).toHaveBeenCalledWith("/playlists");
  });

  test("getPlaylistById() calls GET /playlists/:id", () => {
    API.get.mockResolvedValue({ data: {} });
    playlistService.getPlaylistById("pl1");
    expect(API.get).toHaveBeenCalledWith("/playlists/pl1");
  });

  test("createPlaylist() posts to /playlists with data", () => {
    API.post.mockResolvedValue({ data: {} });
    const data = { playlistName: "My Playlist" };
    playlistService.createPlaylist(data);
    expect(API.post).toHaveBeenCalledWith("/playlists", data);
  });

  test("updatePlaylist() puts to /playlists/:id with data", () => {
    API.put.mockResolvedValue({ data: {} });
    const data = { playlistName: "Renamed Playlist" };
    playlistService.updatePlaylist("pl1", data);
    expect(API.put).toHaveBeenCalledWith("/playlists/pl1", data);
  });

  test("deletePlaylist() sends DELETE to /playlists/:id", () => {
    API.delete.mockResolvedValue({ data: {} });
    playlistService.deletePlaylist("pl1");
    expect(API.delete).toHaveBeenCalledWith("/playlists/pl1");
  });

  test("addSongToPlaylist() posts songId to /playlists/:id/songs", () => {
    API.post.mockResolvedValue({ data: {} });
    playlistService.addSongToPlaylist("pl1", "song1");
    expect(API.post).toHaveBeenCalledWith("/playlists/pl1/songs", { songId: "song1" });
  });

  test("removeSongFromPlaylist() sends DELETE to /playlists/:id/songs/:songId", () => {
    API.delete.mockResolvedValue({ data: {} });
    playlistService.removeSongFromPlaylist("pl1", "song1");
    expect(API.delete).toHaveBeenCalledWith("/playlists/pl1/songs/song1");
  });
});