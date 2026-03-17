import { useState, useEffect, useCallback } from "react";
import { getAllSongsAdmin, addSong, updateSong, deleteSong, toggleVisibility } from "../services/songService";
import { getAlbums }    from "../services/albumService";
import { getArtists }   from "../services/artistService";
import { getDirectors } from "../services/directorService";

export const useAdminSongs = () => {
  const [songs,     setSongs]     = useState([]);
  const [albums,    setAlbums]    = useState([]);
  const [artists,   setArtists]   = useState([]);
  const [directors, setDirectors] = useState([]);
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState("");

  const fetch = useCallback(() => {
    setLoading(true);
    Promise.all([getAllSongsAdmin(), getAlbums(), getArtists(), getDirectors()])
      .then(([s, al, ar, d]) => {
        setSongs(s.data); setAlbums(al.data);
        setArtists(ar.data); setDirectors(d.data);
        setError("");
      })
      .catch(() => setError("Failed to load songs."))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const add    = useCallback((formData) => addSong(formData).then(fetch),    [fetch]);
  const update = useCallback((id, data) => updateSong(id, data).then(fetch), [fetch]);
  const remove = useCallback((id)       => deleteSong(id).then(fetch),       [fetch]);
  const toggle = useCallback((id)       => toggleVisibility(id).then(fetch), [fetch]);

  return { songs, albums, artists, directors, loading, error, add, update, remove, toggle };
};