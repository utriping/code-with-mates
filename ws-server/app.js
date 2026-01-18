import http from "http";
import express from "express";
import { Server } from "socket.io";
import initSocket from "./initSocket.js";
import cors from "cors";
const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(cors());
initSocket(server);

server.listen(4000, () => console.log("listening on port 4000"));
