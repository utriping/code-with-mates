import http from "http";
import express from "express";
import { Server } from "socket.io";
import initSocket from "./initSocket.js";
import cors from "cors";
import { getIo } from "./initSocket.js";
import { Router } from "express";
const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
initSocket(server);


// a user sends a message to a particular friend
// Router.pso("/api/auth/send-message", (req, res) => {
//     const { message,friendId } = req.body;
//     if(!friendId){
//         throw new Error("friendId is required");
//     }

//     getIo().to(friendId).emit("received message", message);
//     res.status(200).json({ message: "Message sent successfully" });
// });
server.listen(4000, () => console.log("listening on port 4000"));
