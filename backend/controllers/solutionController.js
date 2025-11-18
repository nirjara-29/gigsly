import sql from "../config/db.js";
import fs from "fs";
import { evaluateSolution } from "../ai/evaluateSolution.js";

//
// -----------------------------------------------------
//  CREATE SOLUTION (Freelancer submits)
// -----------------------------------------------------
//
export const createSolution = async (req, res) => {
  try {
    console.log("Incoming solution request:", {
      body: req.body,
      files: req.files,
      auth: req.auth,
    });

    const { explanation } = req.body;
    const { problemId } = req.params;
    const userId = req.auth?.userId;

    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    // -----------------------------------------------------
    // 1️⃣ Handle uploaded files
    // -----------------------------------------------------
    const files = req.files || [];
    const fileUrls = files.map(
      (f) => `${req.protocol}://${req.get("host")}/uploads/${f.filename}`
    );

    // -----------------------------------------------------
    // 2️⃣ Insert initial solution row
    // -----------------------------------------------------
    const [solution] = await sql`
      INSERT INTO solutions (problem_id, user_id, code_url, explanation, status)
      VALUES (
        ${problemId},
        ${userId},
        ${JSON.stringify(fileUrls)},
        ${explanation},
        'pending_review'
      )
      RETURNING *
    `;

    // -----------------------------------------------------
    // 3️⃣ Fetch checklist for this problem
    // -----------------------------------------------------
    const [problem] = await sql`
      SELECT checklist_id
      FROM problems
      WHERE id = ${problemId}
    `;

    if (!problem || !problem.checklist_id) {
      return res.status(400).json({ error: "No checklist found for problem" });
    }

    const [checklist] = await sql`
      SELECT items
      FROM checklists
      WHERE id = ${problem.checklist_id}
    `;

    // -----------------------------------------------------
    // 4️⃣ Parse checklist.items safely
    // -----------------------------------------------------
    let checklistItems = [];

    try {
      // checklist.items is stored as JSON string OR as raw JSON
      if (Array.isArray(checklist.items)) {
        checklistItems = checklist.items;
      } else if (typeof checklist.items === "string") {
        checklistItems = JSON.parse(checklist.items);
      } else if (typeof checklist.items.items === "object") {
        // case when stored as { items: [...] }
        checklistItems = checklist.items.items;
      }
    } catch (err) {
      console.error("❌ Failed to parse checklist JSON:", err);
      return res.status(500).json({ error: "Invalid checklist format" });
    }

    // Final fallback (never empty)
    if (!Array.isArray(checklistItems)) checklistItems = [];

    // -----------------------------------------------------
    // 5️⃣ Read full code text for AI evaluation
    // -----------------------------------------------------
    let fullCodeText = "";

    for (const url of fileUrls) {
      try {
        const filename = url.split("/").pop();
        const filepath = `./uploads/${filename}`;
        fullCodeText +=
          `\n\n# File: ${filename}\n` +
          fs.readFileSync(filepath, "utf-8");
      } catch (err) {
        console.error("❌ Failed reading uploaded file:", err);
      }
    }

    // -----------------------------------------------------
    // 6️⃣ Run AI evaluation
    // -----------------------------------------------------
    const aiResult = await evaluateSolution(
      checklistItems,
      explanation,
      fullCodeText
    );

    if (!aiResult) {
      return res.status(500).json({ error: "AI evaluation failed" });
    }

    const { score, per_item } = aiResult;

    // -----------------------------------------------------
    // 7️⃣ Determine acceptance status
    // -----------------------------------------------------
    const requiredFailed = per_item.some((pi) => {
      const item = checklistItems.find((c) => c.id === pi.item_id);
      return item?.required && !pi.passed;
    });

    const finalStatus = requiredFailed ? "needs_fix" : "accepted_by_ai";

    // -----------------------------------------------------
    // 8️⃣ Update DB with AI results
    // -----------------------------------------------------
    const [updated] = await sql`
      UPDATE solutions
      SET ai_score = ${score},
          ai_details = ${aiResult},
          status = ${finalStatus}
      WHERE id = ${solution.id}
      RETURNING *
    `;

    // -----------------------------------------------------
    // 9️⃣ Respond
    // -----------------------------------------------------
    res.status(201).json({
      message: "Solution evaluated",
      status: updated.status,
      ai_score: updated.ai_score,
      ai_details: updated.ai_details,
    });
  } catch (err) {
    console.error("❌ Error submitting solution:", err);
    res.status(500).json({ error: err.message });
  }
};

//
// -----------------------------------------------------
//  GET SOLUTIONS FOR A PROBLEM (Freelancer public)
// -----------------------------------------------------
//
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

//
// -----------------------------------------------------
//  OWNER VIEW — See accepted / paid solutions only
// -----------------------------------------------------
//
export const getProblemSolutions = async (req, res) => {
  try {
    const { problemId } = req.params;
    const userId = req.auth?.userId;

    const [problem] = await sql`
      SELECT id, user_id
      FROM problems
      WHERE id = ${problemId}
    `;

    if (!problem) return res.status(404).json({ error: "Problem not found" });
    if (problem.user_id !== userId)
      return res.status(403).json({ error: "Not authorized" });

    const solutions = await sql`
      SELECT 
        s.id,
        s.user_id,
        s.explanation,
        s.code_url,
        s.ai_score,
        s.ai_details,
        s.status,
        s.created_at
      FROM solutions s
      WHERE s.problem_id = ${problemId}
        AND (s.status = 'accepted_by_ai' OR s.status = 'paid' OR s.status = 'released')
      ORDER BY s.ai_score DESC NULLS LAST, s.created_at ASC
    `;

    const formatted = solutions.map((s) => ({
      id: s.id,
      userId: s.user_id,
      explanation: s.explanation,
      attachments:
        s.code_url && typeof s.code_url === "string"
          ? JSON.parse(s.code_url)
          : s.code_url || [],
      ai_score: s.ai_score,
      ai_details:
        typeof s.ai_details === "string"
          ? JSON.parse(s.ai_details)
          : s.ai_details,
      status: s.status,
      submittedAt: s.created_at,
    }));

    res.json(formatted);
  } catch (err) {
    console.error("❌ Error fetching problem solutions:", err);
    res.status(500).json({ error: "Failed to fetch problem solutions" });
  }
};

//
// -----------------------------------------------------
//  GET ALL MY SOLUTIONS (Freelancer dashboard)
// -----------------------------------------------------
//
export const getMySolutions = async (req, res) => {
  const userId = req.auth?.userId;

  try {
    // 1️⃣ Fetch all solutions by this freelancer
    const solutions = await sql`
      SELECT 
        s.id,
        s.status,
        s.created_at AS "submittedAt",
        s.explanation,
        s.ai_score,
        s.ai_details,
        p.title AS "problemTitle",
        p.budget AS "payment"
      FROM solutions s
      JOIN problems p ON s.problem_id = p.id
      WHERE s.user_id = ${userId}
      ORDER BY s.created_at DESC
    `;

    // 2️⃣ Safely parse AI details (prevent crash!)
    const formatted = solutions.map(s => {
      let parsedDetails = {};

      try {
        parsedDetails =
          typeof s.ai_details === "string"
            ? JSON.parse(s.ai_details)
            : s.ai_details;
      } catch (err) {
        parsedDetails = {}; // fallback so UI never breaks
      }

      return {
        ...s,
        ai_details: parsedDetails
      };
    });

    // 3️⃣ Get total earnings (only PAID solutions)
    const [earningsRow] = await sql`
      SELECT COALESCE(SUM(p.budget), 0) AS "totalEarned"
      FROM solutions s
      JOIN problems p ON s.problem_id = p.id
      WHERE s.user_id = ${userId}
        AND s.status = 'paid'
    `;

    // 4️⃣ ALWAYS return an array for frontend
    return res.json({
      totalEarned: earningsRow.totalEarned ?? 0,
      solutions: Array.isArray(formatted) ? formatted : []
    });

  } catch (err) {
    console.error("❌ Error fetching my solutions:", err);

    // FAIL SAFE — send predictable shape
    return res.json({
      totalEarned: 0,
      solutions: []
    });
  }
};



//
// -----------------------------------------------------
//  GET SINGLE SOLUTION
// -----------------------------------------------------
//
export const getSolutionById = async (req, res) => {
  try {
    const { solutionId } = req.params;

    const [sol] = await sql`
      SELECT 
        s.*, 
        p.title AS problem_title
      FROM solutions s
      JOIN problems p ON s.problem_id = p.id
      WHERE s.id = ${solutionId}
    `;

    if (!sol) return res.status(404).json({ error: "Solution not found" });

    const parsedDetails =
      typeof sol.ai_details === "string"
        ? JSON.parse(sol.ai_details)
        : sol.ai_details;

    res.json({
      id: sol.id,
      problemId: sol.problem_id,
      problemTitle: sol.problem_title,
      explanation: sol.explanation,
      status: sol.status,
      ai_score: sol.ai_score,
      ai_details: parsedDetails,
      createdAt: sol.created_at,
    });
  } catch (err) {
    console.error("❌ Error fetching solution:", err);
    res.status(500).json({ error: "Failed to fetch solution" });
  }
};
