import sql from "../config/db.js";

// Create a new problem
export const createProblem = async (req, res) => {
  const { user_id, title, description, budget, deadline } = req.body;

  const files = req.files || [];
  const attachment_urls = files.map(f => f.filename);

  if (!user_id || !title || !description || !budget || !deadline) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const [newProblem] = await sql`
      INSERT INTO problems (user_id, title, description, budget, deadline, attachment_url)
      VALUES (${user_id}, ${title}, ${description}, ${budget}, ${deadline}, ${JSON.stringify(attachment_urls)},'open')
      RETURNING *
    `;
    res.status(201).json(newProblem);
  } catch (err) {
    console.error("❌ Error inserting problem:", err);
    res.status(500).json({ error: err.message });
  }
};

// Get all problems (public)
export const getProblems = async (req, res) => {
  try {
    const problems = await sql`
      SELECT id, user_id, title, description, budget, deadline, created_at,
             CASE
               WHEN attachment_url IS NULL THEN '[]'::json
               WHEN left(attachment_url, 1) = '[' THEN attachment_url::json
               ELSE json_build_array(attachment_url)
             END AS attachment_url,
             status
      FROM problems
      ORDER BY created_at DESC
    `;
    res.json(problems);
  } catch (err) {
    console.error("❌ Error fetching problems:", err);
    res.status(500).send("Error fetching problems");
  }
};

// Get single problem by ID
export const getProblemById = async (req, res) => {
  const { id } = req.params;
  try {
    const [problem] = await sql`
      SELECT id, user_id, title, description, budget, deadline, status,
             CASE
               WHEN attachment_url IS NULL THEN '[]'::json
               WHEN left(attachment_url,1) = '[' THEN attachment_url::json
               ELSE json_build_array(attachment_url)
             END AS attachment_url,
             created_at
      FROM problems
      WHERE id = ${id}
    `;
    if (!problem) return res.status(404).json({ error: "Problem not found" });
    if (!problem.status) problem.status = "open";
    res.json(problem);
  } catch (err) {
    console.error("❌ Error fetching problem:", err);
    res.status(500).json({ error: err.message });
  }
};
