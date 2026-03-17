import SongCard from "./SongCard";

function SongList({ songs, onPlay }) {

  return (
    <div className="row">
      {songs.map((song) => (
        <div
          key={song._id}
          className="col-lg-3 col-md-4 col-sm-6 mb-4"
        >
          <SongCard song={song} onPlay={onPlay} />
        </div>
      ))}
    </div>
  );
}

export default SongList;