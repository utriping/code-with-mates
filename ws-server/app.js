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
    await connectDb(); 
    initSocket(server); 
    server.listen(4000, () => console.log("Server running on port 4000"));
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
}

startServer();
