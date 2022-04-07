const http = require("http");
const SocketIO = require("socket.io");
const express = require("express");
const app = express();
const httpServer = http.createServer(app);
const io = SocketIO(httpServer, { cors: { origin: "*", methods: ["GET", "POST"] } });

io.on("connection", (socket) => {
  socket.onAny((event) => {
    console.log(`Socket Event: ${event}`);
  });
  socket.on("enter_room", (room) => {
    socket.join(room);
    socket.to(room).emit("welcome");
  });
  socket.on("disconnecting", () => {
    socket.rooms.forEach((room) => {
      socket.to(room).emit("bye");
    });
  });
  socket.on("send_message", (room, msg, done) => {
    socket.to(room).emit("send_message", room, msg);
    done();
  });
});
const handleListen = () => console.log(`Listening on http://localhost:8000`);
httpServer.listen(8000, handleListen);
