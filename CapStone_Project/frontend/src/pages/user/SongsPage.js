import React, { useEffect, useState } from "react";
import { searchSongs } from "../../services/songService";
import SongList from "../../components/songs/SongList";
import { MusicNoteIcon } from "../../components/common/Icons";
import { usePlayer } from "../../context/PlayerContext";
import { usePagination } from "../../hooks/usePagination";
import Pagination from "../../components/common/Pagination";

const THEME_BG      = "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)";
const BTN_PRIMARY   = "#7e0404";
const BTN_SECONDARY = "#4a5568";

function SongsPage() {
  const { playSong } = usePlayer();

  const [search,   setSearch]   = useState("");
  const [artist,   setArtist]   = useState("");
  const [album,    setAlbum]    = useState("");
  const [director, setDirector] = useState("");
  const [songs,    setSongs]    = useState([]);

  const pg = usePagination(songs, 12);

  useEffect(() => {
    searchSongs({}).then(res => setSongs(res.data)).catch(console.error);
  }, []);

  const handlePlay = (song) => playSong(song, songs);

  const handleSearch = () => {
    searchSongs({ search, artist, album, director })
      .then(res => setSongs(res.data)).catch(console.error);
  };

  const handleClear = () => {
    setSearch(""); setArtist(""); setAlbum(""); setDirector("");
    searchSongs({}).then(res => setSongs(res.data));
  };

  const themedBtn = (color) => ({
    background: color, color: "#fff", border: "none", borderRadius: "6px",
    padding: "6px 18px", fontWeight: "500", cursor: "pointer", transition: "opacity 0.2s",
  });

  return (
    <div>
      <h2 className="d-flex align-items-center gap-2 mb-4" style={{ color: BTN_PRIMARY }}>
        <MusicNoteIcon size={24} color={BTN_PRIMARY} /> Songs
      </h2>

      <div className="mb-4 p-3 rounded-3 shadow-sm"
        style={{ background: THEME_BG, border: "1px solid rgba(0,0,0,0.07)" }}>
        <div className="row g-2 align-items-center">
          <div className="col-12 col-md-3">
            <input className="form-control" placeholder="Song name" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="col-6 col-md-2">
            <input className="form-control" placeholder="Artist" value={artist} onChange={e => setArtist(e.target.value)} />
          </div>
          <div className="col-6 col-md-2">
            <input className="form-control" placeholder="Album" value={album} onChange={e => setAlbum(e.target.value)} />
          </div>
          <div className="col-12 col-md-3">
            <input className="form-control" placeholder="Director" value={director} onChange={e => setDirector(e.target.value)} />
          </div>
          <div className="col-12 col-md-2 d-flex gap-2 mt-3 mt-md-0">
            <button className="flex-grow-1" style={themedBtn(BTN_PRIMARY)}
              onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
              onMouseLeave={e => e.currentTarget.style.opacity = "1"}
              onClick={handleSearch}>Search</button>
            <button className="flex-grow-1" style={themedBtn(BTN_SECONDARY)}
              onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
              onMouseLeave={e => e.currentTarget.style.opacity = "1"}
              onClick={handleClear}>Clear</button>
          </div>
        </div>
      </div>

      <SongList songs={pg.paged} onPlay={handlePlay} />
      <Pagination {...pg} />
    </div>
  );
}

export default SongsPage;
