const { Server } = require("socket.io");
const io = new Server(3000, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("Een gebruiker is verbonden");

  socket.on("play", () => {
    io.emit("play");
    console.log("LP afspelen");
  });

  socket.on("pause", () => {
    io.emit("pause");
    console.log("LP pauzeren");
  });

  socket.on("disconnect", () => {
    console.log("Gebruiker is verbroken");
  });
});
