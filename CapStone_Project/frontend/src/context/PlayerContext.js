import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { AuthContext } from "./AuthContext";

const PlayerContext = createContext();

export const PlayerProvider = ({ children }) => {
  const [currentSong, setCurrentSong] = useState(null);
  const [queue, setQueue]             = useState([]);

  const authCtx = useContext(AuthContext);
  useEffect(() => {
    if (!authCtx?.isAuthenticated) {
      setCurrentSong(null);
      setQueue([]);
    }
  }, [authCtx?.isAuthenticated]);
  const playSong = useCallback((song, songQueue = []) => {
    setCurrentSong(song);
    if (songQueue.length > 0) setQueue(songQueue);
  }, []);

  const playNext = useCallback(() => {
    if (!currentSong || queue.length === 0) return;
    const idx = queue.findIndex(s => s._id === currentSong._id);
    setCurrentSong(queue[idx >= 0 && idx < queue.length - 1 ? idx + 1 : 0]);
  }, [currentSong, queue]);

  const playPrev = useCallback(() => {
    if (!currentSong || queue.length === 0) return;
    const idx = queue.findIndex(s => s._id === currentSong._id);
    setCurrentSong(queue[idx > 0 ? idx - 1 : queue.length - 1]);
  }, [currentSong, queue]);

  const stopPlayer = useCallback(() => {
    setCurrentSong(null);
    setQueue([]);
  }, []);

  return (
    <PlayerContext.Provider value={{ currentSong, queue, playSong, playNext, playPrev, stopPlayer }}>
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error("usePlayer must be used inside <PlayerProvider>");
  return ctx;
};