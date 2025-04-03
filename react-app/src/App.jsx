import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const ws = new WebSocket("ws://localhost:3000");

const App = () => {
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    ws.onmessage = (event) => {
      if (event.data === "play") setPlaying(true);
      if (event.data === "pause") setPlaying(false);
    };
  }, []);

  const togglePlay = () => {
    const action = playing ? "pause" : "play";
    ws.send(action);
    setPlaying(!playing);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
      <motion.div
        className="w-48 h-48 bg-black rounded-full border-4 border-gray-700"
        animate={{ rotate: playing ? 360 : 0 }}
        transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
      />
      <button
        onClick={togglePlay}
        className="mt-6 px-4 py-2 bg-blue-500 rounded"
      >
        {playing ? "Pause" : "Play"}
      </button>
    </div>
  );
};

export default App;
