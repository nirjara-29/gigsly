import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import problemsRouter from "./routes/Problems.js";
import webhookRoute from "./routes/WebhookClerk.js  ";
import solutionsRouter from "./routes/Solutions.js"
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));


// Test route
app.get("/", (req, res) => res.send("Backend is running 🚀"));
app.use("/uploads", express.static("uploads"));

app.use("/api/problems", problemsRouter);
app.use("/api/solutions", solutionsRouter)

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
