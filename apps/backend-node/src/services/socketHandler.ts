import { Server, Socket } from "socket.io";
import { redisClient } from "../server";
import { AuthenticatedSocket } from "../middleware/auth";

export const socketHandler = (io: Server, socket: AuthenticatedSocket) => {
  const userId = socket.data.userId;

  // Join user-specific room
  socket.join(`user:${userId}`);

  // Agent-specific: Join agent room for errand notifications
  if (socket.data.userType === "agent") {
    socket.join("agents");
  }

  // Handle location updates (for live tracking)
  socket.on("location:update", async (data: { latitude: number; longitude: number; errand_id: string }) => {
    console.log(`Location update from ${userId}:`, data);

    // Store location in Redis with expiry
    await redisClient.setEx(
      `location:${userId}`,
      300, // 5 minutes expiry
      JSON.stringify({
        latitude: data.latitude,
        longitude: data.longitude,
        errand_id: data.errand_id,
        updated_at: new Date().toISOString(),
      })
    );

    // Broadcast to errand participants
    io.to(`errand:${data.errand_id}`).emit("location:updated", {
      agent_id: userId,
      latitude: data.latitude,
      longitude: data.longitude,
    });
  });

  // Join errand-specific room
  socket.on("errand:join", (errandId: string) => {
    socket.join(`errand:${errandId}`);
    console.log(`User ${userId} joined errand room: ${errandId}`);
  });

  // Leave errand room
  socket.on("errand:leave", (errandId: string) => {
    socket.leave(`errand:${errandId}`);
  });

  // Send message in errand chat
  socket.on("chat:message", (data: { errand_id: string; message: string }) => {
    const messageData = {
      sender_id: userId,
      sender_email: socket.data.email,
      message: data.message,
      timestamp: new Date().toISOString(),
    };

    io.to(`errand:${data.errand_id}`).emit("chat:message", messageData);
  });

  // Notify new errand to available agents
  socket.on("errand:new", (errandData: any) => {
    io.to("agents").emit("errand:available", errandData);
  });

  // Errand status updates
  socket.on("errand:status", (data: { errand_id: string; status: string }) => {
    io.to(`errand:${data.errand_id}`).emit("errand:status_updated", {
      errand_id: data.errand_id,
      status: data.status,
      updated_at: new Date().toISOString(),
    });
  });

  // Disconnect handler
  socket.on("disconnect", () => {
    console.log(`User disconnected: ${userId}`);
  });
};


