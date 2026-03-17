import { useState, useEffect, useCallback } from "react";
import { getArtists, addArtist, updateArtist, updateArtistPhoto, deleteArtist } from "../services/artistService";

export const useAdminArtists = () => {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  const fetch = useCallback(() => {
    setLoading(true);
    getArtists()
      .then(res => { setArtists(res.data); setError(""); })
      .catch(() => setError("Failed to load artists."))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const add         = useCallback((data)         => addArtist(data).then(fetch),            [fetch]);
  const update      = useCallback((id, data)     => updateArtist(id, data).then(fetch),     [fetch]);
  const updatePhoto = useCallback((id, formData) => updateArtistPhoto(id, formData).then(fetch), [fetch]);
  const remove      = useCallback((id)           => deleteArtist(id).then(fetch),           [fetch]);

  return { artists, loading, error, add, update, updatePhoto, remove };
};