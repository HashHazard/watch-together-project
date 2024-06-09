import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const Chat = ({ socket }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const room = params.get("room");

  useEffect(() => {
    if (room) {
      console.log("Joining room:", room);
      socket.emit("joinRoom", room);
    }
    socket.on("message", (message) => {
      console.log("New message received:", message); // Add a log to debug
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off("message");
    };
  }, [room]);

  const handleSendMessage = () => {
    console.log(`send ${room} ${message}`);
    socket.emit("message", { room, message });
    setMessage("");
  };

  return (
    <div>
      <h1>Room: {room}</h1>
      <div className="messagess">
        {messages.map((msg, index) => (
          <div key={index}>{msg}</div>
        ))}
      </div>
      <input
        type="text"
        placeholder="Enter message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={handleSendMessage}>Send</button>
    </div>
  );
};

export default Chat;
