import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import "./App.css";

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
    if (isPlaying) {
      socket.emit("pause");
    } else {
      socket.emit("play");
    }
  };

  return (
    <div className="container">
      <h1>Virtuele LP-speler</h1>
      <div className={`lp ${isPlaying ? "active" : "paused"}`}></div>
      <button onClick={togglePlay}>{isPlaying ? "Pauze" : "Start"}</button>
    </div>
  );
}

export default App;
