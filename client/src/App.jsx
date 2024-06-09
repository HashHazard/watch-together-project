import { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { socket } from "./socket";
import { Link, Route, Routes, useLocation } from "react-router-dom";
import Landing from "./components/Landing";

import { FaPlay } from "react-icons/fa";
import SearchInput from "./components/SearchInput";
import Chat from "./components/Chat";
import PlayerWindow from "./components/PlayerWindow";
import Footer from "./components/Footer";

function App() {
  const [showCreateRoomBtn, setShowCreateRoomBtn] = useState(true);
  const [src, setSrc] = useState("youtube/_cMxraX_5RE");
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/") setShowCreateRoomBtn(true);
    else setShowCreateRoomBtn(false);
  }, [location]);

  return (
    <div className="app">
      <div className="content">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/chat" element={<Chat socket={socket} />} />
          <Route
            path="/room"
            element={<PlayerWindow socket={socket} src={src} />}
          />
        </Routes>
      </div>
    </div>
  );
}

export default App;
