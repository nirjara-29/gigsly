// backend/middleware/clerkAuth.js
import { getAuth, clerkClient } from "@clerk/express";
import sql from "../config/db.js";

export const clerkAuth = (req, res, next) => {
  try {
    const { userId } = authenticateRequest(req); // verifies token from Authorization header
    req.auth = { userId };
    next();
  } catch (err) {
    console.error("❌ Clerk auth error:", err);
    res.status(401).json({ error: "Unauthorized" });
  }
};
