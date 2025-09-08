// controllers/solutionController.js
import sql from "../config/db.js";
import multer from "multer";

// Submit a solution
export const createSolution = async (req, res) => {
  try {
    const { explanation } = req.body;
    const { problemId } = req.params;

    // Placeholder user id; later integrate Clerk authentication
    const user_id = req.user?.id || 1;

    const files = req.files || [];
    const codeUrls = files.map(f => `${req.protocol}://${req.get("host")}/uploads/${f.filename}`);

    console.log("📩 Files:", req.files);
    console.log("📝 Explanation:", req.body.explanation);
    console.log("➡️ Code URLs:", codeUrls);

    const [newSolution] = await sql`
      INSERT INTO solutions (problem_id, user_id, code_url, explanation, status)
      VALUES (${problemId}, ${user_id}, ${JSON.stringify(codeUrls)}, ${explanation}, 'pending_review')
      RETURNING *
    `;

    res.status(201).json(newSolution);
  } catch (err) {
    console.error("❌ Error submitting solution:", err);

    if (err instanceof multer.MulterError) {
      return res.status(400).json({ error: `Multer Error: ${err.message}` });
    }

    res.status(500).json({ error: err.message });
  }
};

// Get all solutions for a problem (no auth)
export const getSolutionsByProblem = async (req, res) => {
  try {
    const { problemId } = req.params;
    const solutions = await sql`
      SELECT * FROM solutions WHERE problem_id = ${problemId} ORDER BY created_at DESC
    `;
    res.json(solutions);
  } catch (err) {
    console.error("❌ Error fetching solutions:", err);
    res.status(500).json({ error: err.message });
  }
};

export const getProblemSolutions = async (req, res) => {
  const { problemId } = req.params;
  const userId = req.user?.id;

  try {
    const [problem] = await sql`
      SELECT * FROM problems WHERE id = ${problemId} AND user_id = ${userId}
    `;

    if (!problem) {
      return res.status(403).json({ error: "Not authorized to view solutions for this problem" });
    }

    const solutions = await sql`
      SELECT s.*, u.name as freelancerName
      FROM solutions s
      JOIN users u ON s.user_id = u.id
      WHERE s.problem_id = ${problemId}
    `;

    res.json(solutions);
  } catch (err) {
    console.error("❌ Error fetching problem solutions:", err);
    res.status(500).json({ error: "Failed to fetch problem solutions" });
  }
};
export const getMySolutions = async (req, res) => {
  const userId = req.auth.userId; // Clerk sets this
  try {
    const solutions = await sql`
      SELECT * FROM solutions WHERE user_id = ${userId} ORDER BY created_at DESC
    `;
    res.json(solutions);
  } catch (err) {
    console.error("❌ Error fetching my solutions:", err);
    res.status(500).json({ error: err.message });
  }
};

