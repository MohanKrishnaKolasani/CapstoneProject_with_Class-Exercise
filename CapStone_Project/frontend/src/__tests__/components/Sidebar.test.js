import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Sidebar from "../../components/common/Sidebar";

jest.mock("react-router-dom");

function renderSidebar(role = "user") {
  localStorage.setItem("role", role);
  return render(
    <MemoryRouter>
      <Sidebar />
    </MemoryRouter>
  );
}

afterEach(() => localStorage.clear());

describe("Sidebar component", () => {
  describe("links visible to all users", () => {
    test("renders Songs link", () => {
      renderSidebar("user");
      expect(screen.getByRole("link", { name: /songs/i })).toBeInTheDocument();
    });

    test("renders Playlists link", () => {
      renderSidebar("user");
      expect(screen.getByRole("link", { name: /playlists/i })).toBeInTheDocument();
    });

    test("renders Profile link", () => {
      renderSidebar("user");
      expect(screen.getByRole("link", { name: /profile/i })).toBeInTheDocument();
    });

    test("renders Music Library heading", () => {
      renderSidebar("user");
      expect(screen.getByText("Music Library")).toBeInTheDocument();
    });
  });

  describe("admin-only links", () => {
    test("shows Admin Dashboard for admin role", () => {
      renderSidebar("admin");
      expect(screen.getByRole("link", { name: /admin dashboard/i })).toBeInTheDocument();
    });

    test("shows Manage Songs for admin role", () => {
      renderSidebar("admin");
      expect(screen.getByRole("link", { name: /manage songs/i })).toBeInTheDocument();
    });

    test("shows Manage Artists for admin role", () => {
      renderSidebar("admin");
      expect(screen.getByRole("link", { name: /manage artists/i })).toBeInTheDocument();
    });

    test("shows Manage Directors for admin role", () => {
      renderSidebar("admin");
      expect(screen.getByRole("link", { name: /manage directors/i })).toBeInTheDocument();
    });

    test("shows Manage Albums for admin role", () => {
      renderSidebar("admin");
      expect(screen.getByRole("link", { name: /manage albums/i })).toBeInTheDocument();
    });

    test("does NOT show Admin Dashboard for regular user", () => {
      renderSidebar("user");
      expect(screen.queryByRole("link", { name: /admin dashboard/i })).not.toBeInTheDocument();
    });

    test("does NOT show Manage Songs for regular user", () => {
      renderSidebar("user");
      expect(screen.queryByRole("link", { name: /manage songs/i })).not.toBeInTheDocument();
    });

    test("does NOT show Manage Artists for regular user", () => {
      renderSidebar("user");
      expect(screen.queryByRole("link", { name: /manage artists/i })).not.toBeInTheDocument();
    });
  });

  describe("link href attributes", () => {
    test("Songs link points to /songs", () => {
      renderSidebar("user");
      expect(screen.getByRole("link", { name: /songs/i })).toHaveAttribute("href", "/songs");
    });

    test("Playlists link points to /playlists", () => {
      renderSidebar("user");
      expect(screen.getByRole("link", { name: /playlists/i })).toHaveAttribute("href", "/playlists");
    });

    test("Admin Dashboard link points to /admin", () => {
      renderSidebar("admin");
      expect(screen.getByRole("link", { name: /admin dashboard/i })).toHaveAttribute("href", "/admin");
    });
  });
});