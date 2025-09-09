import sql from "../config/db.js";
import { clerkClient } from "@clerk/clerk-sdk-node";

export const ensureUserExists = async (req, res, next) => {
  try {
    const clerkUserId = req.auth.userId;
    if (!clerkUserId) return res.status(401).json({ error: "Unauthorized" });

    // Check if user already exists
    const [existingUser] = await sql`
      SELECT id FROM users WHERE id = ${clerkUserId}
    `;
    if (existingUser) return next();

    // Fetch full user data from Clerk
    const clerkUser = await clerkClient.users.getUser(clerkUserId);

    const { emailAddresses, firstName, lastName, profileImageUrl } = clerkUser;
    const email = emailAddresses?.[0]?.emailAddress || null;
    const name = `${firstName || ""} ${lastName || ""}`.trim() || null;
    const avatar_url = profileImageUrl || null;

    if (!email) {
      console.error("❌ Clerk user missing email:", clerkUser);
      return res.status(400).json({ error: "Clerk user email is required" });
    }

    // Insert into Neon
    await sql`
      INSERT INTO users (id, email, name, avatar_url)
      VALUES (${clerkUserId}, ${email}, ${name}, ${avatar_url})
    `;

    next();
  } catch (err) {
    console.error("❌ Error ensuring user exists:", err);
    res.status(500).json({ error: "Failed to ensure user exists" });
  }
};
