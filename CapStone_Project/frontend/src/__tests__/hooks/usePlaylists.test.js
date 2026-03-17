import { renderHook, act, waitFor } from "@testing-library/react";
import { usePlaylists } from "../../hooks/usePlaylists";
import * as playlistService from "../../services/playlistService";

jest.mock("../../services/playlistService");

const mockPlaylists = [
  { _id: "p1", playlistName: "Favourites" },
  { _id: "p2", playlistName: "Chill Vibes" },
];

beforeEach(() => {
  jest.clearAllMocks();
  playlistService.getPlaylists.mockResolvedValue({ data: mockPlaylists });
});

describe("usePlaylists hook", () => {
  test("loads playlists on mount", async () => {
    const { result } = renderHook(() => usePlaylists());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.playlists).toHaveLength(2);
    expect(result.current.playlists[0].playlistName).toBe("Favourites");
  });

  test("sets error when fetch fails", async () => {
    playlistService.getPlaylists.mockRejectedValue(new Error("Server error"));
    const { result } = renderHook(() => usePlaylists());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBeDefined();
  });

  test("create() calls createPlaylist and then re-fetches", async () => {
    playlistService.createPlaylist.mockResolvedValue({});
    const { result } = renderHook(() => usePlaylists());
    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await result.current.create({ playlistName: "New Playlist" });
    });

    expect(playlistService.createPlaylist).toHaveBeenCalledWith({ playlistName: "New Playlist" });
    expect(playlistService.getPlaylists).toHaveBeenCalledTimes(2);
  });

  test("rename() calls updatePlaylist with the correct id and data, then re-fetches", async () => {
    playlistService.updatePlaylist.mockResolvedValue({});
    const { result } = renderHook(() => usePlaylists());
    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await result.current.rename("p1", { playlistName: "Renamed" });
    });

    expect(playlistService.updatePlaylist).toHaveBeenCalledWith("p1", { playlistName: "Renamed" });
    expect(playlistService.getPlaylists).toHaveBeenCalledTimes(2);
  });

  test("remove() calls deletePlaylist with the correct id, then re-fetches", async () => {
    playlistService.deletePlaylist.mockResolvedValue({});
    const { result } = renderHook(() => usePlaylists());
    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await result.current.remove("p2");
    });

    expect(playlistService.deletePlaylist).toHaveBeenCalledWith("p2");
    expect(playlistService.getPlaylists).toHaveBeenCalledTimes(2);
  });

  test("refresh() manually re-fetches playlists", async () => {
    const { result } = renderHook(() => usePlaylists());
    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => { await result.current.refresh(); });

    expect(playlistService.getPlaylists).toHaveBeenCalledTimes(2);
  });
});