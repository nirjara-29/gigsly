// backend/middleware/clerkAuth.js
import { getAuth, clerkClient } from "@clerk/express";
import sql from "../config/db.js";

export const clerkAuth = async (req, res, next) => {
  try {
    const { userId } = getAuth(req);

    console.log("Auth header:", req.headers.authorization);
    console.log("Resolved Clerk userId:", userId);

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // 🔹 Fetch full Clerk user details
    const clerkUser = await clerkClient.users.getUser(userId);
    const name = `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim();
    const email = clerkUser.emailAddresses[0]?.emailAddress || null;
    const avatar_url = clerkUser.imageUrl || null;

    // 🔹 Insert or update user in DB
    let [user] = await sql`
      INSERT INTO users (clerk_user_id, name, email, avatar_url)
      VALUES (${userId}, ${name}, ${email}, ${avatar_url})
      ON CONFLICT (clerk_user_id) 
      DO UPDATE SET 
        name = EXCLUDED.name,
        email = EXCLUDED.email,
        avatar_url = EXCLUDED.avatar_url
      RETURNING *;
    `;

    req.auth = { clerkUserId: userId, dbUserId: user.id };
    next();
  } catch (err) {
    console.error("❌ Clerk auth error:", err);
    res.status(401).json({ error: "Unauthorized" });
  }
};
