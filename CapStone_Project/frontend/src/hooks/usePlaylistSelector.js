import { useState, useEffect, useCallback } from "react";
import { getPlaylists, addSongToPlaylist } from "../services/playlistService";

export const usePlaylistSelector = () => {
  const [playlists, setPlaylists] = useState([]);

  useEffect(() => {
    getPlaylists()
      .then((res) => setPlaylists(res.data))
      .catch((err) => console.error(err));
  }, []);

  const addSong = useCallback((playlistId, songId) =>
    addSongToPlaylist(playlistId, songId),
  []);

  return { playlists, addSong };
};
