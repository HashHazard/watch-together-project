import React, { useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";
import { Link, useLocation } from "react-router-dom";
import ProgressBar from "./ProgressBar";
import SearchInput from "./SearchInput";
import { FaPlay } from "react-icons/fa";
import ShareButton from "./ShareButton";

import "@vidstack/react/player/styles/default/theme.css";
import "@vidstack/react/player/styles/default/layouts/video.css";
import {
  MediaPlayer,
  MediaPlayerInstance,
  MediaProvider,
  useMediaRemote,
  useMediaState,
  useStore,
} from "@vidstack/react";
import {
  defaultLayoutIcons,
  DefaultVideoLayout,
} from "@vidstack/react/player/layouts/default";

const PlayerWindow = ({ socket }) => {
  // get room id from query parameter
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const room = params.get("room");

  const [isLeader, setIsLeader] = useState(false);

  const player = useRef(null);
  const remote = useMediaRemote(player);
  const isPaused = useMediaState("paused", player);
  const { seeking } = useStore(MediaPlayerInstance, player);

  const [canPlay, setCanPlay] = useState(false);

  const [url, setUrl] = useState("youtube/_cMxraX_5RE");

  useEffect(() => {
    if (room) {
      console.log("Joining room:", room);
      socket.emit("joinRoom", room);
    }

    // get the time duration of live video
    socket.on("currentState", (state) => {
      console.log(`getting data`, state);
      if (canPlay && state.timestamp !== 0) {
        remote.seek(parseFloat(state.timestamp));
        console.log("Global CurrentState seek", state.timestamp);
      }

      state.playing ? remote.play() : remote.pause();
    });

    socket.on("videoId", (url) => {
      console.log("Global URL received", url);
      if (url) setUrl(url);
    });

    socket.on("playPause", (playing) => {
      console.log("Global play/pause received", playing);
      playing ? remote.play() : remote.pause();
    });

    // seek timestamp
    socket.on("seek", (timestamp) => {
      console.log("Global seek", timestamp);
      if (!seeking) remote.seek(parseFloat(timestamp));
    });

    socket.on("assignLeader", () => {
      console.log("Assigned as leader");
      setIsLeader(true);
    });

    return () => {
      socket.off("currentState");
      socket.off("playPause");
      socket.off("seek");
      socket.off("assignLeader");
      socket.off("videoId");
    };
  }, [room]);

  // sending playing state to every user
  useEffect(() => {
    socket.emit("playPause", { room, playing: !isPaused });
    console.log("change in paused state, playing?", !isPaused);
  }, [isPaused]);

  // sending url to every user
  const handleSearchClick = () => {
    console.log("sending URL to every user", { room, url });
    if (room && url) socket.emit("videoId", { room, url });
  };

  // sending duration update
  const handleTimeUpdate = ({ currentTime }, nativeEvent) => {
    const isTrusted = nativeEvent.originEvent?.isTrusted;
    if (isLeader && !seeking) {
      console.log(currentTime);
      socket.emit("updateTimestamp", { room, timestamp: currentTime });
    }
    // console.log(seeking);
  };

  const handleOnSeeked = (number, nativeEvent) => {
    // the event that triggered the media play request
    const origin = nativeEvent.originEvent; // e.g., PointerEvent

    // was this triggered by an actual person?
    const userPlayed = nativeEvent.isOriginTrusted;

    // equivalent to above
    const isTrusted = nativeEvent.originEvent?.isTrusted;

    console.log(origin, userPlayed, isTrusted);
    if (canPlay) {
      console.log("seeking to", number);
      socket.emit("seek", { room, timestamp: number });
    }
  };

  return (
    <div>
      <Nav url={url} setUrl={setUrl} handleSearchClick={handleSearchClick} />

      <div className="hide-mobile">
        <SearchInput
          url={url}
          setUrl={setUrl}
          handleSearchClick={handleSearchClick}
        />
      </div>

      <div className="window">
        <div className="player-container">
          <MediaPlayer
            onCanPlay={() => setCanPlay(true)}
            crossOrigin
            onTimeUpdate={handleTimeUpdate}
            onSeeked={handleOnSeeked}
            ref={player}
            title="Sprite Fight"
            // src="youtube/_cMxraX_5RE"
            src={url}
          >
            <MediaProvider />
            <DefaultVideoLayout
              thumbnails="https://files.vidstack.io/sprite-fight/thumbnails.vtt"
              icons={defaultLayoutIcons}
            />
          </MediaPlayer>
        </div>

        <div className="chat-container">
          {/* <h4>Chat Room#{room}</h4> */}
          <p className="chat-top">
            Chat Room<strong>#{room}</strong>
          </p>
          <div className="chat-messages">
            <div className="send-message">hi</div>
            <div className="receive-message">hello</div>
            <div className="system-message">New user has joined the room</div>
          </div>
          <input className="chat-input" type="text" />
        </div>
      </div>
    </div>
  );
};

const PlayerWindowss = ({ socket, src }) => {
  const [playing, setPlaying] = useState(false);
  const [timestamp, setTimestamp] = useState();
  const [played, setPlayed] = useState(0);
  const [loaded, setLoaded] = useState(0);
  const [seeking, setSeeking] = useState(false);
  const [isLeader, setIsLeader] = useState(false);
  const [url, setUrl] = useState("");
  const playerRef = useRef(null);

  // get room id from query parameter
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const room = params.get("room");

  useEffect(() => {
    if (room) {
      console.log("Joining room:", room);
      socket.emit("joinRoom", room);
    }

    // get the time duration of live video
    socket.on("currentState", (state) => {
      console.log(`getting data`, state);
      setPlaying(state.playing);
      setTimestamp(state.timestamp);
    });

    // get play/pause state of live video
    socket.on("playPause", (playing) => {
      console.log("getting play/pause", playing);
      setPlaying(playing);
    });

    socket.on("videoId", (url) => {
      setUrl(url);
      console.log("setting url to", url);
    });

    // update timestamp
    socket.on("seek", (timestamp) => {
      console.log("seek", timestamp);
      setTimestamp(timestamp);
      if (playerRef.current) playerRef.current.seekTo(timestamp);
    });

    socket.on("assignLeader", () => {
      console.log("Assigned as leader");
      setIsLeader(true);
    });

    return () => {
      socket.off("currentState");
      socket.off("playPause");
      socket.off("seek");
      socket.off("assignLeader");
      socket.off("videoId");
    };
  }, [room]);

  // useEffect(() => {
  //   if (isLeader) {
  //     const interval = setInterval(() => {
  //       if (playing && !seeking && playerRef.current) {
  //         const currTimestamp = playerRef.current.getCurrentTime();
  //         setTimestamp(currTimestamp);
  //         socket.emit("updateTimestamp", { room, timestamp: currTimestamp });
  //       }
  //     }, 1000);

  //     return () => clearInterval(interval);
  //   }
  // }, [playing, seeking, room, isLeader]);

  useEffect(() => {
    // get play/pause state of live video
    socket.on("playPause", (playing) => {
      console.log("getting play/pause", playing);
      setPlaying(playing);
    });
    return () => {
      socket.off("playPause");
    };
  }, [setPlaying]);

  const handlePlayPause = () => {
    const newPlayingState = !playing;
    setPlaying(newPlayingState);
    console.log("handleplaypause:emit", newPlayingState);
    socket.emit("playPause", { room, playing: newPlayingState });
  };

  const handleSeekMouseDown = () => {
    setSeeking(true);
  };

  const handleSeekChange = (e) => {
    setPlayed(parseFloat(e.target.value));
  };

  const handleSeekMouseUp = (e) => {
    const newTimeStamp = parseFloat(e.target.value);
    setPlayed(newTimeStamp);
    socket.emit("seek", { room, timestamp: newTimeStamp });
    console.log("handleSeekMouseUp:emit", newTimeStamp);
    playerRef?.current.seekTo(newTimeStamp);
    setSeeking(false);
  };

  const handleProgress = (state) => {
    if (!seeking) {
      setPlayed(state.played);
      setLoaded(state.loaded);
      setTimestamp(state.played * playerRef?.current.getDuration());
    }

    if (isLeader) {
      if (playing && !seeking && playerRef.current) {
        console.log(state.played);
        // const currTimestamp = playerRef.current.getCurrentTime();
        // setTimestamp(state.played);
        socket.emit("updateTimestamp", { room, timestamp: state.played });
      }
    }
  };

  const initialTimestamp = () => {
    if (playerRef.current) {
      playerRef.current.seekTo(timestamp);
      console.log(`seeking to ${timestamp}`);
    }
  };

  // useEffect(() => {
  //   socket.emit("videoId", { room, url });
  //   console.log("url changed:", url);
  // }, [url, setUrl]);

  const handleSearchClick = () => {
    console.log("---------------");
    console.log(url);
    console.log("---------------");
    socket.emit("videoId", { room, url });
    console.log("url changed:", url);
  };

  return (
    <div>
      <nav>
        <div>
          <ul className="nav-bar">
            <li>
              <Link to="/" className="link logo">
                <FaPlay />
                <span>Jointly</span>
              </Link>
            </li>
            <li className="unhide-mobile" style={{ flex: "0.5" }}>
              <SearchInput
                url={url}
                setUrl={setUrl}
                handleSearchClick={handleSearchClick}
              />
            </li>
            <li>
              <ShareButton />
            </li>
          </ul>
        </div>
      </nav>

      <div className="hide-mobile">
        <SearchInput
          url={url}
          setUrl={setUrl}
          handleSearchClick={handleSearchClick}
        />
      </div>
      <div className="window">
        <div className="player-container">
          {timestamp !== undefined ? (
            <ReactPlayer
              ref={playerRef}
              controls
              url={url}
              playing={playing}
              onReady={initialTimestamp}
              onPlay={() => setPlaying(true)}
              onPause={() => setPlaying(false)}
              onProgress={handleProgress}
              width="100%"
              height="100%"
            />
          ) : (
            <>Loading...</>
          )}
          <button onClick={handlePlayPause}>
            {playing ? "Pause" : "Play"}
          </button>
          <ProgressBar
            played={played}
            loaded={loaded}
            onSeekChange={handleSeekChange}
            onSeekMouseDown={handleSeekMouseDown}
            onSeekMouseUp={handleSeekMouseUp}
          />
        </div>
        <div className="chat-container">
          <h4>{room}</h4>
        </div>
      </div>
    </div>
  );
};

const PlayerWindoww = ({ socket, src }) => {
  const [pauseOrPlay, setPauseOrPlay] = useState(false);
  const [data, setData] = useState();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const room = params.get("room");
  const [duration, setDuration] = useState({ progress: 0, totalLength: 0 });

  useEffect(() => {
    if (room) {
      console.log("Joining room:", room);
      socket.emit("joinRoom", room);
    }

    socket.on("message", (message) => {
      console.log("New message received:", message); // Add a log to debug
      // setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off("message");
    };
  }, [room]);

  useEffect(() => {
    socket.on("player", (data) => {
      console.log("Player data received:", data.pauseOrPlay);
      setPauseOrPlay(data.pauseOrPlay);
    });

    return () => {
      socket.off("player");
    };
  }, [pauseOrPlay]);

  const handlePause = () => {
    setPauseOrPlay(false);
    socket.emit("player", {
      room,
      pauseOrPlay: false,
      duration: "0",
    });
  };

  const handlePlay = () => {
    setPauseOrPlay(true);
    socket.emit("player", {
      room,
      pauseOrPlay: true,
      duration: "0",
    });
  };

  const playerRef = useRef(null);

  const seekTo30Seconds = () => {
    playerRef.current.seekTo(30);
    // console.log(playerRef.current.getInternalPlayer());
  };

  return (
    <div>
      <h3>Room: {room}</h3>
      <ReactPlayer
        url="https://www.youtube.com/watch?v=x872keruUWQ"
        ref={playerRef}
        playing={pauseOrPlay}
        onPause={handlePause}
        onPlay={handlePlay}
        onProgress={(duration) =>
          setDuration((prev) => ({
            ...prev,
            progress: parseInt(duration.playedSeconds),
          }))
        }
        onDuration={(total) =>
          setDuration((prev) => ({ ...prev, totalLength: parseInt(total) }))
        }
        onSeek={(seconds) => console.log(seconds)}
        controls={true}

        // width="100%"
        // height="100%"
      />
      <ProgressBar played={duration.progress / duration.totalLength} />
      <button onClick={seekTo30Seconds}>Seek to 30 seconds</button>
    </div>
  );
};

const Nav = ({ url, setUrl, handleSearchClick }) => {
  return (
    <nav>
      <div>
        <ul className="nav-bar">
          <li>
            <Link to="/" className="link logo">
              <FaPlay />
              <span>Jointly</span>
            </Link>
          </li>
          <li className="unhide-mobile" style={{ flex: "0.5" }}>
            <SearchInput
              url={url}
              setUrl={setUrl}
              handleSearchClick={handleSearchClick}
            />
          </li>
          <li>
            <ShareButton />
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default PlayerWindow;
