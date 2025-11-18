import sql from "../config/db.js";
import { generateChecklist } from "../ai/checklistGenerator.js";

/* ----------------------------------------------------------
   Utility: Safe JSON Parser for attachment_url
---------------------------------------------------------- */
const safeParse = (value) => {
  try {
    if (!value) return [];
    if (Array.isArray(value)) return value;

    // If it's plain text (e.g. "file.js")
    if (typeof value === "string") {
      if (value.trim().startsWith("[")) return JSON.parse(value);
      return [value]; // wrap single string into array
    }

    return [];
  } catch {
    return [];
  }
};

/* ----------------------------------------------------------
   1️⃣ Create a problem (used when NOT using escrow)
---------------------------------------------------------- */
export const createProblem = async (req, res) => {
  const { title, description, budget, deadline } = req.body;
const files = req.files || [];
const attachment_urls = files.map(f => f.filename);

  const userId = req.auth?.userId;


  if (!userId || !title || !description || !budget || !deadline) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // Insert problem immediately (open)
    const [problem] = await sql`
      INSERT INTO problems (user_id, title, description, budget, deadline, attachment_url, status)
      VALUES (
        ${userId},
        ${title},
        ${description},
        ${budget},
        ${deadline},
        ${JSON.stringify(attachment_urls)},
        'open'
      )
      RETURNING *
    `;

    const problemId = problem.id;

    // Generate AI checklist
    const checklistItems = await generateChecklist(title, description);

    if (checklistItems) {
      // Store checklist JSON properly
      const [newChecklist] = await sql`
        INSERT INTO checklists (problem_id, items)
        VALUES (${problemId}, ${JSON.stringify(checklistItems)})
        RETURNING *
      `;

      await sql`
        UPDATE problems
        SET checklist_id = ${newChecklist.id}
        WHERE id = ${problemId}
      `;

      problem.checklist_id = newChecklist.id;
    }

    res.status(201).json(problem);
  } catch (err) {
    console.error("❌ Error creating problem:", err);
    res.status(500).json({ error: err.message });
  }
};

/* ----------------------------------------------------------
   2️⃣ Get all public "open" problems
---------------------------------------------------------- */
export const getProblems = async (req, res) => {
  try {
    const results = await sql`
      SELECT id, title, description, budget, deadline, status, created_at, attachment_url
      FROM problems
      WHERE status = 'open'
      ORDER BY created_at DESC
    `;

    const formatted = results.map((p) => ({
      ...p,
      attachment_url: safeParse(p.attachment_url),
    }));

    res.json(formatted);
  } catch (err) {
    console.error("❌ Error fetching problems:", err);
    res.status(500).json({ error: err.message });
  }
};

/* ----------------------------------------------------------
   3️⃣ Get problems created by logged-in user
---------------------------------------------------------- */
export const getMyProblems = async (req, res) => {
  try {
    const userId = req.auth.userId;

    const results = await sql`
      SELECT id, user_id, title, description, budget, deadline, created_at, 
             attachment_url, status
      FROM problems
      WHERE user_id = ${userId}
      ORDER BY created_at DESC
    `;

    const formatted = results.map((p) => ({
      ...p,
      attachment_url: safeParse(p.attachment_url),
    }));

    res.json(formatted);
  } catch (err) {
    console.error("❌ Error fetching user problems:", err);
    res.status(500).json({ error: err.message });
  }
};

/* ----------------------------------------------------------
   4️⃣ Get a single problem by ID
---------------------------------------------------------- */
export const getProblemById = async (req, res) => {
  const { id } = req.params;

  try {
    const [problem] = await sql`
      SELECT id, user_id, title, description, budget, deadline, status,
             attachment_url, created_at, checklist_id
      FROM problems
      WHERE id = ${id}
    `;

    if (!problem) return res.status(404).json({ error: "Problem not found" });

    problem.attachment_url = safeParse(problem.attachment_url);
    if (!problem.status) problem.status = "open";

    res.json(problem);
  } catch (err) {
    console.error("❌ Error fetching problem:", err);
    res.status(500).json({ error: err.message });
  }
};
