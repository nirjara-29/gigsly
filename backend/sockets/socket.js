// socket.js
import { Server } from "socket.io";

export function setupSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: "*", // frontend URL (replace with http://localhost:5173 or your deployed URL)
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("✅ User connected:", socket.id);

    // Join a chat room based on problem + owner + client
    socket.on("join_chat_room", ({ problemId, ownerId, clientId, user }) => {
      if (!problemId || !ownerId || !clientId) {
        console.error("⚠️ Missing problemId, ownerId, or clientId");
        return;
      }

      // Create deterministic room ID
      const roomId = `chat_${problemId}_${ownerId}_${clientId}`;
      socket.join(roomId);

      console.log(`👥 ${user?.name || "Unknown"} joined room: ${roomId}`);

      io.to(roomId).emit("system_message", {
        text: `${user?.name || "A user"} has joined the chat`,
        joinedBy: user?.id,
      });
    });

    // Send & broadcast message in that room
    socket.on("send_chat_message", ({ problemId, ownerId, clientId, message }) => {
      if (!problemId || !ownerId || !clientId) {
        console.error("⚠️ Missing identifiers for chat message");
        return;
      }

      const roomId = `chat_${problemId}_${ownerId}_${clientId}`;

      io.to(roomId).emit("receive_chat_message", {
        problemId,
        ownerId,
        clientId,
        message,
      });
    });

    socket.on("disconnect", () => {
      console.log("❌ User disconnected:", socket.id);
    });
  });
}
