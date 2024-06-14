import NavBar from "./NavBar";
import cat from "./../assets/vidplayer.png";
import { Link, useNavigate } from "react-router-dom";
import { FaPlay } from "react-icons/fa";
import { IoIosPeople } from "react-icons/io";
import { MdChat } from "react-icons/md";
import { FaLink } from "react-icons/fa";
import { MdOndemandVideo } from "react-icons/md";
import { useState } from "react";
import { generateRandomRoomName } from "../services/RandomGen";
import Footer from "./Footer";

const Landing = () => {
  const [room, setRoom] = useState("");
  const navigate = useNavigate();

  const handleCreateRoom = () => {
    const randomRoom = generateRandomRoomName(5);
    setRoom(randomRoom);
    if (randomRoom) navigate(`/room?room=${randomRoom}`);
  };

  return (
    <div className="landing">
      <nav>
        <div>
          <ul className="nav-bar">
            <li>
              <Link to="/" className="link logo">
                <FaPlay />
                <span>Jointly</span>
              </Link>
            </li>
            <li>
              <div
                to="/watch"
                className="create-room-button"
                onClick={handleCreateRoom}
              >
                Create Room
              </div>
            </li>
          </ul>
        </div>
      </nav>
      <section className="hero">
        <div className="image-container">
          <img src={cat} alt="cat" className="image" />
          {/* <div className="play-button">
            <FaPlay className="play-icon" />
          </div> */}
        </div>
        <div className="hero-left">
          <div>
            <p className="hero-title">Connect with friends</p>
            <p className="hero-content">
              Share the show, as you watch your favorite videos in perfect flow!
              🎥🌍👫
            </p>
            <p className="hero-content">
              Instant access, <span>no sign-up</span> needed
            </p>
          </div>

          <div onClick={handleCreateRoom} className="big-room-button">
            Create a Room
          </div>
        </div>
      </section>

      <section className="features">
        <h2 className="features">Features</h2>
        <div className="feature-list">
          <div>
            <IoIosPeople size="4rem" />
            <p>Create Watch Parties</p>
          </div>
          <div>
            <FaLink size="2.5rem" />
            <p>Invite friends with shareable link</p>
          </div>
          <div>
            <MdOndemandVideo size="3rem" />
            <p>Play/Pause videos in Sync</p>
          </div>
          <div>
            <MdChat size="2.5rem" />
            <p>Realtime Chat</p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Landing;
