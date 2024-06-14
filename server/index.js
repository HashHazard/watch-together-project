import { createServer } from "http";
import { Server } from "socket.io";

const httpServer = createServer();

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
  },
});

let videoState = new Map();
let leader = new Map();
let videoURL = new Map();

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on("joinRoom", (room) => {
    socket.join(room);
    console.log(`User ${socket.id} joined room: ${room}`);

    socket.to(room).emit("message", {
      name: "system",
      message: "A new user has joined the room:",
    });

    // creating when first user joins
    if (!videoState.has(room)) {
      videoState.set(room, { playing: false, timestamp: 0 });
      leader.set(room, socket.id);
      socket.emit("assignLeader");
    }

    if (videoURL.has(room)) {
      socket.to(room).emit("videoId", videoURL.get(room));
      socket.emit("videoId", videoURL.get(room)); // Emit player data to the joining user

      console.log(videoURL.get(room));
    }
    console.log(videoURL, room);

    // sending player data to user who joined the room
    socket.emit("currentState", videoState.get(room)); // Emit player data to the joining user
    socket.to(room).emit("currentState", videoState.get(room)); // Emit player data to other users in the room
  });

  socket.on("message", ({ room, name, message }) => {
    console.log(`received ${room} ${name} ${message}`);
    io.to(room).emit("message", { name, message });
  });

  // handle play and pause state
  socket.on("playPause", ({ room, playing }) => {
    console.log("playing?", playing);
    const currVideoState = videoState.get(room);
    videoState.set(room, { playing, ...currVideoState });
    io.to(room).emit("playPause", playing);
  });

  socket.on("videoId", ({ room, url }) => {
    console.log("url:", url);
    videoURL.set(room, url);

    console.log(videoURL);
    io.to(room).emit("videoId", url);
  });

  socket.on("seek", ({ room, timestamp }) => {
    const currVideoState = videoState.get(room);

    videoState.set(room, { ...currVideoState, timestamp });

    io.to(room).emit("seek", timestamp);

    console.log("seek: ", videoState.get(room));
  });

  socket.on("updateTimestamp", ({ room, timestamp }) => {
    const currVideoState = videoState.get(room);
    videoState.set(room, { ...currVideoState, timestamp });
    console.log("updateTimestamp:", videoState.get(room));
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
    for (let [room, leaderId] of leader) {
      if (leaderId === socket.id) {
        console.log(`Leader ${socket.id} disconnected from room ${room}`);
        const usersInRoom = io.sockets.adapter.rooms.get(room);
        if (usersInRoom) {
          const newLeader = [...usersInRoom][0];
          leader.set(room, newLeader);
          io.to(newLeader).emit("assignLeader");
        } else {
          leader.delete(room);
          videoState.delete(room);
        }
      }
    }
  });
});

// ------------------------------------
//          NEWCODE
// ------------------------------------

// let dataMap = new Map();

// io.on("connection", (socket) => {
//   console.log(`User connected: ${socket.id}`);

//   socket.on("joinRoom", (room) => {
//     socket.join(room);
//     console.log(`User ${socket.id} joined room: ${room}`);
//     socket.to(room).emit("message", `A new user has joined the room: ${room}`);

//     // creating when first user joins
//     console.log(dataMap);
//     if (!dataMap.has(room)) {
//       dataMap.set(room, { pauseOrPlay: false, duration: "0" });
//     }

//     // sending player data to user who joined the room
//     socket.emit("player", dataMap.get(room)); // Emit player data to the joining user

//     socket.to(room).emit("player", dataMap.get(room)); // Emit player data to other users in the room
//   });

//   socket.on("player", ({ room, pauseOrPlay, duration }) => {
//     dataMap.set(room, { pauseOrPlay, duration });
//     io.to(room).emit("player", dataMap.get(room));
//   });

//   socket.on("message", ({ room, message }) => {
//     console.log(`received ${room} ${message}`);
//     io.to(room).emit("message", message);
//   });

//   socket.on("disconnect", () => {
//     console.log(`User disconnected: ${socket.id}`);
//   });
// });

httpServer.listen(4000, () => console.log("Node server running"));
