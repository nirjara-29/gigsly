// backend/middleware/clerkAuth.js
import { getAuth, clerkClient } from "@clerk/express";

export const clerkAuth = (req, res, next) => {
  try {
    const { userId } = getAuth(req); // verifies token from Authorization header
    if (!userId) throw new Error("No user");
    req.auth = { userId };
    next();
  } catch (err) {
    console.error("❌ Clerk auth error:", err);
    res.status(401).json({ error: "Unauthorized" });
  }
};
