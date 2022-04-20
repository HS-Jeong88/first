const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server, { cors: { origin: "*", methods: ["GET", "POST"] } });
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const next = require("next");
const dev = "production";
const nextApp = next({ dev });
const nextHandler = nextApp.getRequestHandler();

let rooms = [];

io.on("connection", (socket) => {
  socket.onAny((event) => {
    console.log(`Socket Event: ${event}`);
  });
  socket.on("enter_room", (room) => {
    socket.join(room);
    socket.to(room).emit("welcome");
  });
  socket.on("send_message", (room, msg, done) => {
    socket.to(room).emit("send_message", room, msg);
    done();
  });
  socket.on("disconnecting", () => {
    socket.rooms.forEach((room) => {
      socket.to(room).emit("bye");
    });
  });
});
nextApp.prepare().then(() => {
  app.post("/api/message", (req, res) => {
    const { room, msg } = req.body;
    console.log(req.body);
    io.to(room).emit("send_message", room, msg);
    res.json({ result: true });
  });

  app.get("*", (req, res) => {
    return nextHandler(req, res);
  });

  const PORT = 3000;
  const handleListen = () => console.log(`Listening on http://localhost:${PORT}`);
  server.listen(PORT, handleListen);
});
