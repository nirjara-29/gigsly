import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import problemsRouter from "./routes/Problems.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => res.send("Backend is running 🚀"));
app.use("/uploads", express.static("uploads"));

app.use("/api/problems", problemsRouter);

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
