import sql from "../config/db.js";

//Create problem
export const createProblem = async (req, res) => {
  const { user_id, title, description, budget, deadline } = req.body;
  const attachment_urls = files.map(f => f.filename);
  await sql`INSERT INTO problems (user_id, title, ..., attachment_url)
          VALUES (${user_id}, ${title}, ..., ${JSON.stringify(attachment_urls)})`;

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
