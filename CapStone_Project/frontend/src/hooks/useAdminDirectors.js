import { useState, useEffect, useCallback } from "react";
import { getDirectors, addDirector, updateDirector, updateDirectorPhoto, deleteDirector } from "../services/directorService";

export const useAdminDirectors = () => {
  const [directors, setDirectors] = useState([]);
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState("");

  const fetch = useCallback(() => {
    setLoading(true);
    getDirectors()
      .then(res => { setDirectors(res.data); setError(""); })
      .catch(() => setError("Failed to load directors."))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const add         = useCallback((data)         => addDirector(data).then(fetch),              [fetch]);
  const update      = useCallback((id, data)     => updateDirector(id, data).then(fetch),       [fetch]);
  const updatePhoto = useCallback((id, formData) => updateDirectorPhoto(id, formData).then(fetch), [fetch]);
  const remove      = useCallback((id)           => deleteDirector(id).then(fetch),             [fetch]);

  return { directors, loading, error, add, update, updatePhoto, remove };
};