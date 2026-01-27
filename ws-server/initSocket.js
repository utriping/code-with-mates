import { Server } from "socket.io";
import jwt from "jsonwebtoken";
//import message here please
import Message from "../models/Message.model.js";
let io;
export default function initSocket(server) {
  io = new Server(server, {
    cors: {
      origin: "*", // dev only
      methods: ["GET", "POST"],
    },
  });
  //
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) throw new Error("No token");

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = decoded; // attach user to socket
      next();
    } catch (err) {
      next(new Error("Authentication failed"));
    }
  });
  io.on("connection", (socket) => {
    console.log("a user connected");

    socket.on("join room", (chatId) => {
      socket.join(chatId);
    });
    socket.on("send message", async ({ chatId, msg, receiverType }) => {
      console.log("sending message");
      try {
        const message = await Message.create({
          sender: socket.user._id,
          receiver: chatId,
          content: msg,
          receiverType: `${receiverType}`,
          createdAt: new Date(),
          isSeen: false,
        });
        if (!message) throw new Error("Failed to send message");
        const safeMessage = message.toObject();
        delete safeMessage._id;
        delete safeMessage.__v;
        io.to(chatId).emit("received message", safeMessage);
      } catch (err) {
        io.to(chatId).emit("received message", { message: err.message });
      }
    });
    socket.on("typing", (chatId) => {
      socket.to(chatId).emit("user_typing", socket.user._id);
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
