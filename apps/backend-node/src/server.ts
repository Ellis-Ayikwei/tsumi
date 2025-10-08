import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import { createClient } from "redis";
import { socketHandler } from "./services/socketHandler";
import { authMiddleware } from "./middleware/auth";

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CORS_ORIGINS?.split(",") || ["http://localhost:3000"],
    credentials: true,
  },
});

// Redis client
export const redisClient = createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
});

redisClient.on("error", (err) => console.error("Redis Client Error", err));
redisClient.connect();

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "tsumi-realtime" });
});

// Socket.io authentication middleware
io.use(authMiddleware);

// Socket.io connection handler
io.on("connection", (socket) => {
  console.log(`User connected: ${socket.data.userId}`);
  socketHandler(io, socket);
});

const PORT = process.env.PORT || 3001;

httpServer.listen(PORT, () => {
  console.log(`🚀 Tsumi Real-Time Server running on port ${PORT}`);
});

export { io };


