import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import "./App.css";
import plaatImage from "../public/plaat.png";
import tonearmImage from "../public/tonearm.png";
import DeezerPlayer from "./deezerplayer";

const socket = io("http://localhost:3000");

function App() {
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    socket.on("play", () => setIsPlaying(true));
    socket.on("pause", () => setIsPlaying(false));
    return () => {
      socket.off("play");
      socket.off("pause");
    };
  }, []);

  const togglePlay = () => {
    socket.emit(isPlaying ? "pause" : "play");
  };

  return (
    <div className="container">
      <h1>Virtuele LP-speler</h1>

      {/* LP-speler */}
      <div className="player">
        <img
          src={tonearmImage}
          alt="Tonearm"
          className={`tonearm ${isPlaying ? "active" : ""}`}
        />
        <img
          src={plaatImage}
          alt="LP plaat"
          className={`lp ${isPlaying ? "active" : "paused"}`}
        />
      </div>
      <button onClick={togglePlay}>{isPlaying ? "Pauze" : "Start"}</button>

      {/* ✅ Deezer muziekzoeker */}
      <DeezerPlayer />
    </div>
  );
}

export default App;
