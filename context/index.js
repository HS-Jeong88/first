import React, { useState, createContext } from "react";

export const Context = createContext();

export const ContextProvider = (props) => {
  const [roomName, setRoomName] = useState("");
  const [messageTemp, setMessageTemp] = useState("");
  const [messageArr, setMessageArr] = useState([]);
  const [lastInputFocus, setLastInputFocus] = useState(true);
  const value = {
    roomName,
    setRoomName,
    messageTemp,
    setMessageTemp,
    messageArr,
    setMessageArr,
    lastInputFocus,
    setLastInputFocus,
  };

  return <Context.Provider value={value}>{props.children}</Context.Provider>;
};
