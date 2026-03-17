import { renderHook, act, waitFor } from "@testing-library/react";
import { useSongs } from "../../hooks/useSongs";
import * as songService from "../../services/songService";

jest.mock("../../services/songService");

const mockSongs = [
  { _id: "1", songName: "Jai Ho" },
  { _id: "2", songName: "Tum Hi Ho" },
];

beforeEach(() => {
  jest.clearAllMocks();
});

describe("useSongs hook", () => {
  test("starts with loading true and no songs", () => {
    songService.searchSongs.mockReturnValue(new Promise(() => {}));
    const { result } = renderHook(() => useSongs());
    expect(result.current.loading).toBe(true);
    expect(result.current.songs).toHaveLength(0);
  });

  test("fetches songs on mount and sets them in state", async () => {
    songService.searchSongs.mockResolvedValue({ data: mockSongs });
    const { result } = renderHook(() => useSongs());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.songs).toHaveLength(2);
    expect(result.current.songs[0].songName).toBe("Jai Ho");
  });

  test("calls searchSongs with no params on initial load", async () => {
    songService.searchSongs.mockResolvedValue({ data: mockSongs });
    renderHook(() => useSongs());
    await waitFor(() => expect(songService.searchSongs).toHaveBeenCalledWith({}));
  });

  test("sets error state when fetch fails", async () => {
    const mockError = new Error("Network error");
    songService.searchSongs.mockRejectedValue(mockError);
    const { result } = renderHook(() => useSongs());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toEqual(mockError);
  });

  test("search() calls searchSongs with the given params", async () => {
    songService.searchSongs.mockResolvedValue({ data: mockSongs });
    const { result } = renderHook(() => useSongs());
    await waitFor(() => expect(result.current.loading).toBe(false));

    const params = { search: "Jai", artist: "AR Rahman" };
    act(() => { result.current.search(params); });
    await waitFor(() => expect(songService.searchSongs).toHaveBeenCalledWith(params));
  });

  test("clear() calls searchSongs with no params", async () => {
    songService.searchSongs.mockResolvedValue({ data: mockSongs });
    const { result } = renderHook(() => useSongs());
    await waitFor(() => expect(result.current.loading).toBe(false));

    act(() => { result.current.clear(); });
    await waitFor(() => expect(songService.searchSongs).toHaveBeenLastCalledWith({}));
  });

  test("loading becomes false after a successful fetch", async () => {
    songService.searchSongs.mockResolvedValue({ data: mockSongs });
    const { result } = renderHook(() => useSongs());
    await waitFor(() => expect(result.current.loading).toBe(false));
  });
});