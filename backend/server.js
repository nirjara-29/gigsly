import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import path from "path";
import { clerkMiddleware } from "@clerk/express";   // 👈 import Clerk middleware

import problemsRouter from "./routes/Problems.js";
import solutionsRouter from "./routes/Solutions.js"


const app = express();
app.use(cors());
app.use(express.json());



app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));


app.use(clerkMiddleware({
  publishableKey: process.env.CLERK_PUBLISHABLE_KEY,
  secretKey: process.env.CLERK_SECRET_KEY,
}));

// Test route
app.get("/", (req, res) => res.send("Backend is running 🚀"));
app.use("/uploads", express.static("uploads"));


//app.use("/api/webhooks", webhookRoute);
app.use("/api/problems", problemsRouter);
app.use("/api/solutions", solutionsRouter)

const PORT = process.env.PORT;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
