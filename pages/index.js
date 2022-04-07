import React, { useContext, useEffect } from "react";
import { Context } from "../context";

import { io } from "socket.io-client";

// const socket = io("http://139.150.83.176:8000", { transports: ["websocket"] });
const socket = io("http://localhost:8000", { transports: ["websocket"] });

export default function Home() {
  const {
    roomName,
    setRoomName,
    messageTemp,
    setMessageTemp,
    messageArr,
    setMessageArr,
    lastInputFocus,
    setLastInputFocus,
  } = useContext(Context);
  useEffect(() => {
    if (lastInputFocus) {
      const lastInput = document.querySelectorAll(".room > ul > li");
      lastInput && lastInput[lastInput.length - 1]?.focus();
      setLastInputFocus(false);
    }
  });
  const exitRoom = () => {
    socket.disconnect();
    history.go(0);
  };
  const enterRoom = () => {
    const welcome = document.querySelector(".welcome");
    const room = document.querySelector(".room");
    welcome.classList.add("hidden");
    room.classList.remove("hidden");
    socket.emit("enter_room", roomName);
  };
  const sendMessage = () => {
    const input = document.querySelector(".room > form > input");
    if (input.value !== "") {
      socket.emit("send_message", roomName, messageTemp, () => {
        setMessageArr([...messageArr, messageTemp]);
      });
      setMessageTemp("");
      input.value = "";
      setLastInputFocus(true);
    }
  };

  socket.on("welcome", () => {
    setMessageArr([...messageArr, "someone joined!"]);
  });
  socket.on("bye", () => {
    setMessageArr([...messageArr, "someone left."]);
  });
  socket.on("send_message", (roomName, msg) => {
    setMessageArr([...messageArr, msg]);
  });

  return (
    <div className="container">
      <div className="exitRoom">
        <button onClick={exitRoom}>Exit Room</button>
      </div>
      <div className="welcome">
        <form onSubmit={(e) => e.preventDefault()}>
          <input
            placeholder="room name"
            required
            type="text"
            onChange={(e) => {
              setRoomName(e.target.value);
            }}
          />
          <button onClick={enterRoom}>Enter Room</button>
        </form>
      </div>
      <div className="room hidden">
        <h3>{`Room ${roomName}`}</h3>
        <ul>
          {messageArr.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
        <form onSubmit={(e) => e.preventDefault()}>
          <input
            placeholder="message"
            type="text"
            onChange={(e) => setMessageTemp(e.target.value)}
          />
          <button onClick={sendMessage}>Send</button>
        </form>
      </div>
    </div>
  );
}
