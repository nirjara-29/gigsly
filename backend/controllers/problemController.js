import sql from "../config/db.js";

//Create problem

// Create problem
export const createProblem = async (req, res) => {
  const { user_id, title, description, budget, deadline } = req.body;

  // ✅ Get files uploaded via Multer
  const files = req.files || [];
  const attachment_urls = files.map(f => f.filename); // store filenames

  // Validate required fields
  if (!user_id || !title || !description || !budget || !deadline) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // Insert into DB
    const [newProblem] = await sql`
      INSERT INTO problems (user_id, title, description, budget, deadline, attachment_url)
      VALUES (${user_id}, ${title}, ${description}, ${budget}, ${deadline}, ${JSON.stringify(attachment_urls)})
      RETURNING *
    `;
    res.status(201).json(newProblem);
  } catch (err) {
    console.error("❌ Error inserting problem:", err);
    res.status(500).json({ error: err.message });
  }
};

//Get all problems
export const getProblems = async (req, res) => {
  try {
    const problems = await sql`SELECT * FROM problems ORDER BY created_at DESC`;
    res.json(problems);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error fetching problems");
  }
};

//Get single problem

export const getProblemById = async (req, res) => {
  const { id } = req.params;
  try {
    const [problem] = await sql`SELECT * FROM problems WHERE id = ${id}`;
    if (!problem) return res.status(404).json({ error: "Problem not found" });
    res.json(problem);
  } catch (err) {
    console.error("❌ Error fetching problem:", err);
    res.status(500).json({ error: err.message });
  }
};
