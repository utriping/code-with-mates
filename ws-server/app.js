import http from "http";
import express from "express";
import { Server } from "socket.io";
import initSocket from "./initSocket.js";
import cors from "cors";
import { getIo } from "./initSocket.js";
import { Router } from "express";
import { connectDb } from "@/lib/connectDB.js";
const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
async function startServer() {
  try {
    await connectDb(); // wait for DB
    initSocket(server); // init sockets
    server.listen(4000, () => console.log("Server running on port 4000"));
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
}

await startServer();
// a user sends a message to a particular friend
// Router.pso("/api/auth/send-message", (req, res) => {
//     const { message,friendId } = req.body;
//     if(!friendId){
//         throw new Error("friendId is required");
//     }

//     getIo().to(friendId).emit("received message", message);
//     res.status(200).json({ message: "Message sent successfully" });
// });
