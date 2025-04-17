import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import "./App.css";
import plaatImage from "../public/plaat.png";
import tonearmImage from "../public/tonearm.png";
import DeezerPlayer from "./deezerplayer";

const socket = io("http://localhost:3000");

function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [albums, setAlbums] = useState([]);
  const deezerPlayerRef = useRef(null);

  useEffect(() => {
    socket.on("play", () => {
      setIsPlaying(true);
      deezerPlayerRef.current?.play();
    });

    socket.on("pause", () => {
      setIsPlaying(false);
      deezerPlayerRef.current?.pause();
    });

    return () => {
      socket.off("play");
      socket.off("pause");
    };
  }, []);

  const togglePlay = () => {
    socket.emit(isPlaying ? "pause" : "play");
  };

  return (
    <div className="main-container">
      <div className={`player-container ${albums.length > 0 ? "blurred" : ""}`}>
        <h1>Virtuele LP-speler</h1>
        <div className="turntable">
          <img
            src={plaatImage}
            alt="LP plaat"
            className={`lp ${isPlaying ? "active" : "paused"}`}
          />
          <img
            src={tonearmImage}
            alt="Tonearm"
            className={`tonearm ${isPlaying ? "active" : ""}`}
          />
        </div>
        <button onClick={togglePlay}>{isPlaying ? "Pauze" : "Start"}</button>
      </div>

      <div className="search-container">
        <DeezerPlayer
          ref={deezerPlayerRef}
          albums={albums}
          setAlbums={setAlbums}
          socket={socket}
        />
      </div>
    </div>
  );
}

export default App;
