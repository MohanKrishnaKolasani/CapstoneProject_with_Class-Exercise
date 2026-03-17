import Navbar from "../components/common/Navbar";
import SongPlayer from "../components/songs/SongPlayer";
import { usePlayer } from "../context/PlayerContext";
import { useAuth } from "../hooks/useAuth";

function MainLayout({ children }) {
  const { currentSong } = usePlayer();
  const { isAdmin } = useAuth();

  const showPlayer = !isAdmin && !!currentSong;

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <main
        className="flex-grow-1 p-3 p-md-4"
        style={{ paddingBottom: showPlayer ? "96px" : undefined }}
      >
        <div className="container main-content-section">
          {children}
        </div>
      </main>
      <footer
        className="bg-dark text-white-50 py-3 text-center"
        style={{ marginBottom: showPlayer ? "72px" : 0 }}
      >
        <small>&copy; {new Date().getFullYear()} Music Library Capstone. All rights reserved.</small>
      </footer>

      {showPlayer && <SongPlayer />}
    </div>
  );
}

export default MainLayout;