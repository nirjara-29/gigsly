import { authenticateRequest } from "@clerk/express";

export  const  clerkAuth = (req, res, next) => {
  try {
    console.log(req.headers);
    const { userId } =  authenticateRequest(req); 
    console.log(userId)// verifies token from Authorization header
    req.auth = { userId };
    next();
  } catch (err) {
    res.status(401).json({ error: "Unauthorized" });
  }
};
