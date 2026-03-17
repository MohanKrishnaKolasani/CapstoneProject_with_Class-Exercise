import { useState, useEffect, useCallback } from "react";
import { getPlaylistById, removeSongFromPlaylist } from "../services/playlistService";

export const usePlaylistDetail = (id) => {
  const [playlist, setPlaylist] = useState(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");

  const refresh = useCallback(() => {
    setLoading(true);
    getPlaylistById(id)
      .then((res) => { setPlaylist(res.data); setError(""); })
      .catch(() => setError("Failed to load playlist. Please try again."))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => { refresh(); }, [refresh]);

  const removeSong = useCallback((songId) =>
    removeSongFromPlaylist(id, songId).then(refresh),
  [id, refresh]);

  return { playlist, loading, error, refresh, removeSong };
};
