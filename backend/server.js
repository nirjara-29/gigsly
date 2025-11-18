import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import path from "path";
import { clerkMiddleware } from "@clerk/express";
import http from "http";
import cron from "node-cron";
import { processExpiredEscrows } from "./controllers/expiryController.js";
import problemsRouter from "./routes/Problems.js";
import solutionsRouter from "./routes/Solutions.js";
import paymentsRouter from "./routes/Payments.js";

import { setupSocket } from "./sockets/socket.js";

const app = express();
const server = http.createServer(app);
setupSocket(server);

// Middleware
app.use(cors());
app.use(express.json());

// Serve uploaded files
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Clerk Authentication
app.use(clerkMiddleware({
  publishableKey: process.env.CLERK_PUBLISHABLE_KEY,
  secretKey: process.env.CLERK_SECRET_KEY,
}));


// Test route
app.get("/", (req, res) => res.send("Backend is running 🚀"));

// Routes
app.use("/api/problems", problemsRouter);
app.use("/api/solutions", solutionsRouter);
app.use("/api/payments", paymentsRouter);

cron.schedule("0 * * * *", async () => {
  try {
    console.log("cron: running processExpiredEscrows...");
    const results = await processExpiredEscrows(); // when called without req it returns results
    console.log("cron: processExpiredEscrows results:", results);
  } catch (err) {
    console.error("cron: error:", err);
  }
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

/*setTimeout(() => {
  console.log("Running refund test (DEV timeout)...");
  processExpiredEscrows()
    .then(r => console.log("Refund test result:", r))
    .catch(err => console.error("Refund test error:", err));
}, 5000); */