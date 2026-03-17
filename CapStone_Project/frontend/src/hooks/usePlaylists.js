import { useState, useEffect, useCallback } from "react";
import { getPlaylists, createPlaylist, updatePlaylist, deletePlaylist } from "../services/playlistService";

export const usePlaylists = () => {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState(null);

  const fetch = useCallback(() => {
    setLoading(true);
    return getPlaylists()
      .then((res) => setPlaylists(res.data))
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const create = useCallback((data) =>
    createPlaylist(data).then(fetch), [fetch]);

  const rename = useCallback((id, data) =>
    updatePlaylist(id, data).then(fetch), [fetch]);

  const remove = useCallback((id) =>
    deletePlaylist(id).then(fetch), [fetch]);

  return { playlists, loading, error, create, rename, remove, refresh: fetch };
};
