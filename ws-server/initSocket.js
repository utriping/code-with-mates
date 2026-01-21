import { Server } from "socket.io";

let io;
export default function initSocket(server) {
  io = new Server(server, {
    cors: {
      origin: "*", // dev only
      methods: ["GET", "POST"],
    },
  });
  //
  io.on("connection", (socket) => {
    console.log(socket);
    
    console.log("a user connected");

    socket.on("send message", (msg) => {
      console.log("sending message");
      io.emit("received message", msg);
    });
    socket.on("disconnect", () => {
      console.log("user disconnected");
    });
  });
}
export const getIo = () => {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }
  return io;
};
