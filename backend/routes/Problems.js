import express from "express";
import sql from "../config/db.js";
const router = express.Router();


router.get("/", async (req, res) => {
    try {
      const problems = await sql`SELECT * FROM problems ORDER BY created_at DESC`;
      res.json(problems); // No `.rows` needed
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Error fetching problems");
    }
  });


router.post("/", async (req, res) => {
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


router.get("/:id", async (req, res) => {
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



  export default router;