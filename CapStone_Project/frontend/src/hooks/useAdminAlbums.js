import { useState, useEffect, useCallback } from "react";
import { getAlbums, addAlbum, updateAlbum, deleteAlbum } from "../services/albumService";
import { getDirectors } from "../services/directorService";

export const useAdminAlbums = () => {
  const [albums,    setAlbums]    = useState([]);
  const [directors, setDirectors] = useState([]);
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState("");

  const fetch = useCallback(() => {
    setLoading(true);
    Promise.all([getAlbums(), getDirectors()])
      .then(([al, d]) => { setAlbums(al.data); setDirectors(d.data); setError(""); })
      .catch(() => setError("Failed to load albums."))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const add    = useCallback((fd)       => addAlbum(fd).then(fetch),        [fetch]);
  const update = useCallback((id, fd)   => updateAlbum(id, fd).then(fetch), [fetch]);
  const remove = useCallback((id)       => deleteAlbum(id).then(fetch),     [fetch]);

  return { albums, directors, loading, error, add, update, remove };
};