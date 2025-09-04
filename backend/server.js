import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import sql from "./config/db.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => res.send("Backend is running 🚀"));

// Test connection
async function testConnection() {
  try {
    const res = await sql`SELECT NOW()`;
    console.log("✅ Connected to Neon:", res[0]);
  } catch (err) {
    console.error("❌ Connection error:", err.message);
  }
}
testConnection();

// GET all problems
app.get("/api/problems", async (req, res) => {
  try {
    const problems = await sql`SELECT * FROM problems ORDER BY created_at DESC`;
    res.json(problems); // No `.rows` needed
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error fetching problems");
  }
});

// POST a new problem
app.post("/api/problems", async (req, res) => {
  const { user_id, title, description, budget, deadline, attachment_url } = req.body;

  // Basic validation
  if (!user_id || !title || !description || !budget || !deadline) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const [newProblem] = await sql`
      INSERT INTO problems (user_id, title, description, budget, deadline, attachment_url)
      VALUES (${user_id}, ${title}, ${description}, ${budget}, ${deadline}, ${attachment_url})
      RETURNING *
    `;

    res.status(201).json(newProblem);
  } catch (err) {
    console.error("❌ Full Error:", err); // Log full error object
    res.status(500).json({ error: err.message });
  }
  
});

// GET a single problem by ID
app.get("/api/problems/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const problems = await sql`SELECT * FROM problems WHERE id = ${id}`;
    if (problems.length === 0) return res.status(404).send("Problem not found");
    res.json(problems[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error fetching problem");
  }
});

// --------------------- END PROBLEMS ROUTES ---------------------
const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
