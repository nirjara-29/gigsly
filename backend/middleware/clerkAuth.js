import { authenticateRequest } from "@clerk/express";

export const clerkAuth = (req, res, next) => {
  try {
    const { userId } = authenticateRequest(req); // verifies token from Authorization header
    req.auth = { userId };
    next();
  } catch (err) {
    res.status(401).json({ error: "Unauthorized" });
  }
};
