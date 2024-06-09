import { io } from "socket.io-client";

const URL =
  process.env.NODE_ENV === "production" ? undefined : "http://localhost:4000";

export const socket = io(URL);

export const joinRoom = (room) => {
  socket.emit("joinRoom", room);
};

export const assignLeader = (callback) => {
  socket.on("assignLeader", () => callback());
};

export const getCurrentVideoState = (callback) => {
  socket.on("currentState", (state) => callback(state));
};

export const getPlayPauseState = (callback) => {
  socket.on("playPause", (playing) => callback(playing));
};

export function getVideoId(cb) {
  socket.on("videoId", (url) => cb(url));
}

export const getSeek = (callback) => {
  socket.on("seek", (timestamp) => callback(timestamp));
};

/*
socketEvent: 
  - currentState: get current video state
  - playPause: get play or pause state
  - videoId: get url of video
  - seek: get timestamp after seeking
*/
export const getData = (socketEvent, callback) => {
  socket.on(socketEvent, (data) => callback(data));
};

// socketEvent: playPause, videoId, seek, updateTimestamp
export const setPlayState = ({ room, playing }) => {
  socket.emit("playPause", { room, playing });
};

export const setVideoId = ({ room, url }) => {
  socket.emit("videoId", { room, url });
};

export const setSeek = ({ room, timestamp }) => {
  socket.emit("seek", { room, timestamp });
};

export const setUpdateTimestamp = ({ room, timestamp }) => {
  socket.emit("updateTimestamp", { room, timestamp });
};
