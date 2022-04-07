import { Server } from "socket.io";
import { io } from "socket.io-client";

const socket = io("http://localhost:8000", { transports: ["websocket"] });

export default function handler(req, res) {
  if (req.method === "POST") {
    if (res.socket.server.io) {
      console.log("Socket is already running");
      const { room, msg } = req.body;
      socket.to(room).emit("send_message", msg);
    } else {
      console.log("Socket is initialized");
    }
    res.json({ result: true });
  } else {
    //
  }
}

// appRouter.route("/api/message").post((req, res) => {
//   const { msg } = req.body;
//   io.on("connection", (socket) => {
//     socket.rooms.forEach((room) => {
//       socket.to(room).emit("send_message", msg);
//     });
//   });
//   res.json();
// });
