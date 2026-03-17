import API from "../api/axiosConfig";

export const getPlaylists = () => API.get("/playlists");

export const getPlaylistById = (id) => API.get(`/playlists/${id}`);

export const createPlaylist = (data) =>
  API.post("/playlists", data);

export const updatePlaylist = (id, data) =>
  API.put(`/playlists/${id}`, data);

export const deletePlaylist = (id) =>
  API.delete(`/playlists/${id}`);

export const addSongToPlaylist = (playlistId, songId) =>
  API.post(`/playlists/${playlistId}/songs`, { songId });

export const removeSongFromPlaylist = (playlistId, songId) =>
  API.delete(`/playlists/${playlistId}/songs/${songId}`);