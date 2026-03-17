import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import SongCard from "../../components/songs/SongCard";
import * as playlistService from "../../services/playlistService";

jest.mock("../../services/playlistService");

const mockSong = {
  _id:         "song1",
  songName:    "Jai Ho",
  albumId:     { albumName: "Slumdog Millionaire" },
  artistId:    [{ artistName: "AR Rahman" }],
  directorId:  { directorName: "Gulzar" },
  releaseDate: "2008-01-01",
  duration:    245,
};

function renderSongCard(song = mockSong, onPlay = jest.fn()) {
  playlistService.getPlaylists.mockResolvedValue({ data: [] });
  return render(<SongCard song={song} onPlay={onPlay} />);
}

describe("SongCard component", () => {
  beforeEach(() => jest.clearAllMocks());

  describe("collapsed view (default)", () => {
    test("renders the song name", () => {
      renderSongCard();
      expect(screen.getByText("Jai Ho")).toBeInTheDocument();
    });

    test("renders the album name in collapsed view", () => {
      renderSongCard();
      expect(screen.getByText(/slumdog millionaire/i)).toBeInTheDocument();
    });

    test("renders the artist name in collapsed view", () => {
      renderSongCard();
      expect(screen.getByText(/ar rahman/i)).toBeInTheDocument();
    });

    test("renders the director name in collapsed view", () => {
      renderSongCard();
      expect(screen.getByText(/gulzar/i)).toBeInTheDocument();
    });

    test("shows 'View Details' button by default", () => {
      renderSongCard();
      expect(screen.getByText("View Details")).toBeInTheDocument();
    });

    test("shows 'Play' button", () => {
      renderSongCard();
      expect(screen.getByText("Play")).toBeInTheDocument();
    });

    test("does NOT show Song Details panel in collapsed state", () => {
      renderSongCard();
      expect(screen.queryByText("Song Details")).not.toBeInTheDocument();
    });
  });

  describe("expanded view (after clicking View Details)", () => {
    test("shows Song Details panel after clicking View Details", () => {
      renderSongCard();
      fireEvent.click(screen.getByText("View Details"));
      expect(screen.getByText("Song Details")).toBeInTheDocument();
    });

    test("shows Singer(s) label in expanded view", () => {
      renderSongCard();
      fireEvent.click(screen.getByText("View Details"));
      expect(screen.getByText(/singer\(s\)/i)).toBeInTheDocument();
    });

    test("shows Music Director label in expanded view", () => {
      renderSongCard();
      fireEvent.click(screen.getByText("View Details"));
      expect(screen.getByText(/music director/i)).toBeInTheDocument();
    });

    test("shows Release Date label in expanded view", () => {
      renderSongCard();
      fireEvent.click(screen.getByText("View Details"));
      expect(screen.getByText(/release date/i)).toBeInTheDocument();
    });

    test("shows 'Hide Details' button when expanded", () => {
      renderSongCard();
      fireEvent.click(screen.getByText("View Details"));
      expect(screen.getByText("Hide Details")).toBeInTheDocument();
    });

    test("collapses back when Hide Details is clicked", () => {
      renderSongCard();
      fireEvent.click(screen.getByText("View Details"));
      fireEvent.click(screen.getByText("Hide Details"));
      expect(screen.queryByText("Song Details")).not.toBeInTheDocument();
    });
  });

  describe("play button", () => {
    test("calls onPlay with the song when Play is clicked", () => {
      const onPlay = jest.fn();
      renderSongCard(mockSong, onPlay);
      fireEvent.click(screen.getByText("Play"));
      expect(onPlay).toHaveBeenCalledWith(mockSong);
    });

    test("calls onPlay exactly once", () => {
      const onPlay = jest.fn();
      renderSongCard(mockSong, onPlay);
      fireEvent.click(screen.getByText("Play"));
      expect(onPlay).toHaveBeenCalledTimes(1);
    });
  });

  describe("graceful rendering with missing data", () => {
    test("shows N/A for missing album", () => {
      const song = { ...mockSong, albumId: null };
      renderSongCard(song);
      expect(screen.getByText(/n\/a/i)).toBeInTheDocument();
    });

    test("shows N/A for missing artist list", () => {
      const song = { ...mockSong, artistId: [] };
      renderSongCard(song);
      fireEvent.click(screen.getByText("View Details"));
      const naElements = screen.getAllByText(/n\/a/i);
      expect(naElements.length).toBeGreaterThan(0);
    });
  });
});