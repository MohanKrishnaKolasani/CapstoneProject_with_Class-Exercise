import { useState, useEffect } from "react";
import { getAllSongsAdmin } from "../services/songService";
import { getArtists }      from "../services/artistService";
import { getDirectors }    from "../services/directorService";
import { getAlbums } from "../services/albumService";

export const useAdminStats = () => {
  const [stats, setStats] = useState({ songs: 0, artists: 0, directors: 0, albums: 0 });

  useEffect(() => {
    Promise.all([getAllSongsAdmin(), getArtists(), getDirectors(), getAlbums()])
      .then(([songs, artists, directors, albums]) => {
        setStats({
          songs:     songs.data.length,
          artists:   artists.data.length,
          directors: directors.data.length,
          albums:    albums.data.length,
        });
      })
      .catch((err) => console.error("Failed to fetch stats", err));
  }, []);

  return { stats };
};
