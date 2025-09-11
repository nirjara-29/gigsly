// socket.js
import { Server } from "socket.io";

export function setupSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: "*", // frontend URL
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("✅ User connected:", socket.id);

    // Join a specific solution chat room
    socket.on("join_solution_room", ({ solutionId, user }) => {
      socket.join(`solution_${solutionId}`);
      console.log(`${user.name} joined solution room: ${solutionId}`);
      io.to(`solution_${solutionId}`).emit("system_message", {
        text: `${user.name} has joined the chat`,
      });
    });

    // Send & broadcast message to solution room
    socket.on("send_solution_message", ({ solutionId, message }) => {
      io.to(`solution_${solutionId}`).emit("receive_solution_message", {
        solutionId,
        message,
      });
    });

    socket.on("disconnect", () => {
      console.log("❌ User disconnected:", socket.id);
    });
  });
}
