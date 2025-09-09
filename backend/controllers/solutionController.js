import sql from "../config/db.js";

export const createSolution = async (req, res) => {
  try {
    console.log("Incoming solution request:", {
      body: req.body,
      files: req.files,
      auth: req.auth,
    });

    const { explanation } = req.body;
    const { problemId } = req.params;
    const user_id = req.auth?.UserId;

    if (!user_id) return res.status(401).json({ error: "Unauthorized" });

    const files = req.files || [];
    const codeUrls = files.map(f => `${req.protocol}://${req.get("host")}/uploads/${f.filename}`);

    const [newSolution] = await sql`
      INSERT INTO solutions (problem_id, user_id, code_url, explanation, status)
      VALUES (${problemId}, ${userId}, ${JSON.stringify(codeUrls)}, ${explanation}, 'pending_review')
      RETURNING *
    `;

    res.status(201).json(newSolution);
  } catch (err) {
    console.error("❌ Error submitting solution:", err);
    res.status(500).json({ error: err.message });
  }
};

// Public: get all solutions for a problem
export const getSolutionsByProblem = async (req, res) => {
  try {
    const { problemId } = req.params;
    const solutions = await sql`
      SELECT s.*, u.name as freelancerName, u.avatar_url
      FROM solutions s
      JOIN users u ON s.user_id = u.id
      WHERE s.problem_id = ${problemId}
      ORDER BY s.created_at DESC
    `;
    res.json(solutions);
  } catch (err) {
    console.error("❌ Error fetching solutions:", err);
    res.status(500).json({ error: err.message });
  }
};

// Get solutions for a problem you own
export const getProblemSolutions = async (req, res) => {
  const { problemId } = req.params;
  const userId = req.auth?.dbUserId; // ✅ numeric DB ID

  try {
    const [problem] = await sql`
      SELECT * FROM problems WHERE id = ${problemId} AND user_id = ${userId}
    `;

    if (!problem) {
      return res.status(403).json({ error: "Not authorized to view solutions for this problem" });
    }

    const solutions = await sql`
      SELECT s.*, u.name as freelancerName, u.email, u.avatar_url
      FROM solutions s
      JOIN users u ON s.user_id = u.id
      WHERE s.problem_id = ${problemId}
      ORDER BY s.created_at DESC
    `;

    res.json(solutions);
  } catch (err) {
    console.error("❌ Error fetching problem solutions:", err);
    res.status(500).json({ error: "Failed to fetch problem solutions" });
  }
};

// Get all my solutions
export const getMySolutions = async (req, res) => {
  const userId = req.auth?.UserId; // ✅ numeric DB ID
  try {
    const solutions = await sql`
      SELECT 
        s.id,
        s.status,
        s.created_at AS "submittedAt",
        s.explanation,
        p.title AS "problemTitle",
        p.budget AS "payment"
      FROM solutions s
      JOIN problems p ON s.problem_id = p.id
      WHERE s.user_id = ${userId}
      ORDER BY s.created_at DESC
    `;
    res.json(solutions);
  } catch (err) {
    console.error("❌ Error fetching my solutions:", err);
    res.status(500).json({ error: err.message });
  }
};
