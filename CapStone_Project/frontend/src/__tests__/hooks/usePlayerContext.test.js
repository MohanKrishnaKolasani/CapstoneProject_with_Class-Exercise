import React from "react";
import { renderHook, act } from "@testing-library/react";
import { PlayerProvider, usePlayer } from "../../context/PlayerContext";

const wrapper = ({ children }) => <PlayerProvider>{children}</PlayerProvider>;

const mockSongs = [
  { _id: "1", songName: "Song A" },
  { _id: "2", songName: "Song B" },
  { _id: "3", songName: "Song C" },
];

describe("PlayerContext – usePlayer()", () => {
  test("throws if used outside PlayerProvider", () => {
    const consoleError = jest.spyOn(console, "error").mockImplementation(() => {});
    expect(() => renderHook(() => usePlayer())).toThrow(
      "usePlayer must be used inside <PlayerProvider>"
    );
    consoleError.mockRestore();
  });

  test("initial state: currentSong is null and queue is empty", () => {
    const { result } = renderHook(() => usePlayer(), { wrapper });
    expect(result.current.currentSong).toBeNull();
    expect(result.current.queue).toHaveLength(0);
  });

  describe("playSong()", () => {
    test("sets currentSong correctly", () => {
      const { result } = renderHook(() => usePlayer(), { wrapper });
      act(() => result.current.playSong(mockSongs[0], mockSongs));
      expect(result.current.currentSong).toEqual(mockSongs[0]);
    });

    test("sets the queue when a songQueue is provided", () => {
      const { result } = renderHook(() => usePlayer(), { wrapper });
      act(() => result.current.playSong(mockSongs[0], mockSongs));
      expect(result.current.queue).toHaveLength(3);
    });

    test("does not replace the queue when no songQueue is provided", () => {
      const { result } = renderHook(() => usePlayer(), { wrapper });
      act(() => result.current.playSong(mockSongs[0], mockSongs));
      act(() => result.current.playSong(mockSongs[1]));
      expect(result.current.queue).toHaveLength(3);
    });
  });

  describe("playNext()", () => {
    test("advances to the next song in the queue", () => {
      const { result } = renderHook(() => usePlayer(), { wrapper });
      act(() => result.current.playSong(mockSongs[0], mockSongs));
      act(() => result.current.playNext());
      expect(result.current.currentSong).toEqual(mockSongs[1]);
    });

    test("wraps around to the first song from the last song", () => {
      const { result } = renderHook(() => usePlayer(), { wrapper });
      act(() => result.current.playSong(mockSongs[2], mockSongs));
      act(() => result.current.playNext());
      expect(result.current.currentSong).toEqual(mockSongs[0]);
    });

    test("does nothing if no song is playing", () => {
      const { result } = renderHook(() => usePlayer(), { wrapper });
      act(() => result.current.playNext());
      expect(result.current.currentSong).toBeNull();
    });
  });

  describe("playPrev()", () => {
    test("moves to the previous song in the queue", () => {
      const { result } = renderHook(() => usePlayer(), { wrapper });
      act(() => result.current.playSong(mockSongs[1], mockSongs));
      act(() => result.current.playPrev());
      expect(result.current.currentSong).toEqual(mockSongs[0]);
    });

    test("wraps around to the last song from the first song", () => {
      const { result } = renderHook(() => usePlayer(), { wrapper });
      act(() => result.current.playSong(mockSongs[0], mockSongs));
      act(() => result.current.playPrev());
      expect(result.current.currentSong).toEqual(mockSongs[2]);
    });

    test("does nothing if no song is playing", () => {
      const { result } = renderHook(() => usePlayer(), { wrapper });
      act(() => result.current.playPrev());
      expect(result.current.currentSong).toBeNull();
    });
  });

  describe("stopPlayer()", () => {
    test("clears the currentSong", () => {
      const { result } = renderHook(() => usePlayer(), { wrapper });
      act(() => result.current.playSong(mockSongs[0], mockSongs));
      act(() => result.current.stopPlayer());
      expect(result.current.currentSong).toBeNull();
    });

    test("clears the queue", () => {
      const { result } = renderHook(() => usePlayer(), { wrapper });
      act(() => result.current.playSong(mockSongs[0], mockSongs));
      act(() => result.current.stopPlayer());
      expect(result.current.queue).toHaveLength(0);
    });
  });
});