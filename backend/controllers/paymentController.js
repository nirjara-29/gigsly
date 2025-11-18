import sql from "../config/db.js";
import razorpay from "../config/razorpay.js";
import { generateChecklist } from "../ai/checklistGenerator.js";

// =======================================================
// CREATE PROBLEM WITH ESCROW
// =======================================================
export const createProblemEscrow = async (req, res) => {
  try {
    const { title, description, budget, deadline } = req.body;
    const userId = req.auth.userId;

    // Uploaded files
    const files = req.files || [];
    const attachment_urls = files.map(f => f.filename);

    // Create Razorpay order
    const order = await razorpay.orders.create({
      amount: Math.round(Number(budget) * 100),
      currency: "INR",
      receipt: `escrow_${Date.now()}`,
    });

    // Create pending problem
    const [problem] = await sql`
      INSERT INTO problems (
        user_id, title, description, budget, deadline,
        attachment_url, status
      )
      VALUES (
        ${userId}, ${title}, ${description}, ${budget}, ${deadline},
        ${JSON.stringify(attachment_urls)}, 'pending_payment'
      )
      RETURNING *
    `;

    // Create escrow payment row
    const [payment] = await sql`
      INSERT INTO payments (problem_id, owner_id, amount, razorpay_order_id, status)
      VALUES (${problem.id}, ${userId}, ${budget}, ${order.id}, 'pending')
      RETURNING *
    `;

    res.json({ order, problem, payment });

  } catch (err) {
    console.error("❌ createProblemEscrow error:", err);
    res.status(500).json({ error: err.message });
  }
};

// =======================================================
// VERIFY PAYMENT (RAZORPAY CALLBACK)
// =======================================================
export const verifyProblemPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id } = req.body;

    const [payment] = await sql`
      UPDATE payments
      SET razorpay_payment_id = ${razorpay_payment_id},
          status = 'escrow'
      WHERE razorpay_order_id = ${razorpay_order_id}
      RETURNING *
    `;

    if (!payment) {
      return res.status(400).json({ error: "Payment not found" });
    }

    const problemId = payment.problem_id;

    const [problem] = await sql`
      SELECT * FROM problems WHERE id = ${problemId}
    `;
    if (!problem) {
      return res.status(400).json({ error: "Problem missing" });
    }

    // Generate AI checklist
    let checklistItems = await generateChecklist(problem.title, problem.description);

    if (typeof checklistItems === "string") {
      try {
        checklistItems = JSON.parse(checklistItems);
      } catch {}
    }

    const [newChecklist] = await sql`
      INSERT INTO checklists (problem_id, items)
      VALUES (${problemId}, ${JSON.stringify(checklistItems)})
      RETURNING *
    `;

    await sql`
      UPDATE problems
      SET status = 'open', checklist_id = ${newChecklist.id}
      WHERE id = ${problemId}
    `;

    res.json({ success: true, checklist: newChecklist });

  } catch (err) {
    console.error("❌ verifyProblemPayment error:", err);
    res.status(500).json({ error: err.message });
  }
};

// =======================================================
// RELEASE PAYMENT TO FREELANCER
// =======================================================
export const releasePayment = async (req, res) => {
  try {
    const { problemId } = req.params;
    const { solverId } = req.body; // from frontend
    const ownerId = req.auth.userId;

    // 1️⃣ Validate payment row
    const [payment] = await sql`
      SELECT * FROM payments
      WHERE problem_id = ${problemId}
    `;

    if (!payment) {
      return res.status(404).json({ error: "Payment record not found" });
    }

    if (payment.owner_id !== ownerId) {
      return res.status(403).json({ error: "Not authorized" });
    }

    if (payment.status === "released") {
      return res.status(400).json({ error: "Payment already released" });
    }

    // 2️⃣ Find accepted solution by this solver
    const [solution] = await sql`
      SELECT * FROM solutions
      WHERE problem_id = ${problemId}
        AND user_id = ${solverId}
        AND status = 'accepted_by_ai'
      LIMIT 1
    `;

    if (!solution) {
      return res.status(400).json({ error: "Accepted solution not found" });
    }

    // 3️⃣ Update payment → released
    await sql`
      UPDATE payments
      SET status = 'released', released_to = ${solverId},released_at = NOW() 
      WHERE problem_id = ${problemId}
    `;

    // 4️⃣ Update solution → paid
    await sql`
      UPDATE solutions
      SET status = 'paid'
      WHERE id = ${solution.id}
    `;

    // 5️⃣ Mark problem as completed
await sql`
  UPDATE problems
  SET status = 'completed'
  WHERE id = ${problemId}
`;


    


    res.json({ success: true, message: "Payment released successfully" });

  } catch (err) {
    console.error("❌ releasePayment error:", err);
    res.status(500).json({ error: err.message });
  }
};
