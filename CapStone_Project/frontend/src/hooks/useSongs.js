import { useState, useEffect, useCallback } from "react";
import { searchSongs } from "../services/songService";

export const useSongs = () => {
  const [songs, setSongs]     = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const fetchSongs = useCallback((params = {}) => {
    setLoading(true);
    setError(null);
    return searchSongs(params)
      .then((res) => setSongs(res.data))
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetchSongs(); }, [fetchSongs]);

  const search = useCallback((params) => fetchSongs(params), [fetchSongs]);
  const clear  = useCallback(() => fetchSongs(), [fetchSongs]);

  return { songs, loading, error, search, clear };
};
