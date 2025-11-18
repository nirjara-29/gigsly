// backend/controllers/expiryController.js
import sql from "../config/db.js";
import razorpay from "../config/razorpay.js";

/**
 * Process expired escrows:
 * - If deadline < now AND no accepted_by_ai solutions → refund money
 * - Works for cron OR direct HTTP call
 */
export const processExpiredEscrows = async (req, res) => {
  const invokedByHttp = !!req;

  try {
    // 1️⃣ Find all payments in escrow where the problem deadline has passed
    const candidates = await sql`
      SELECT 
        p.id AS payment_id,
        p.problem_id,
        p.amount,
        p.razorpay_payment_id,
        pr.user_id AS owner_id,
        pr.title AS problem_title,
        pr.deadline
      FROM payments p
      JOIN problems pr ON p.problem_id = pr.id
      WHERE p.status = 'escrow'
        AND pr.deadline < NOW()::date
    `;

    const results = [];

    for (const c of candidates) {
      // 2️⃣ Check if an accepted solution exists
      const accepted = await sql`
        SELECT 1 FROM solutions 
        WHERE problem_id = ${c.problem_id}
          AND status = 'accepted_by_ai'
        LIMIT 1
      `;

     // ✔ If there are accepted solutions → maybe auto-release
if (accepted.length > 0) {
  // Check if deadline + 2 days has passed
  const deadlinePlus2 = new Date(c.deadline);
  deadlinePlus2.setDate(deadlinePlus2.getDate() + 2);

  const now = new Date();

  if (now < deadlinePlus2) {
    // owner still has time
    results.push({ 
      payment_id: c.payment_id, 
      action: "waiting_owner_release", 
      until: deadlinePlus2 
    });
    continue;
  }

  // ⚠ Deadline +2 days passed → auto-release payment
  const [bestSolution] = await sql`
    SELECT *
    FROM solutions
    WHERE problem_id = ${c.problem_id}
      AND status = 'accepted_by_ai'
    ORDER BY ai_score DESC NULLS LAST
    LIMIT 1
  `;

  if (!bestSolution) {
    results.push({ 
      payment_id: c.payment_id, 
      action: "no_solution_found_even_accepted_flag_present" 
    });
    continue;
  }

  // Try Razorpay release or simulate in test mode
  try {
    await sql.begin(async (tx) => {
      // mark payment released
      await tx`
        UPDATE payments
        SET status = 'released',
            released_to = ${bestSolution.user_id},
            released_at = NOW()
        WHERE id = ${c.payment_id}
      `;

      // mark solution as paid
      await tx`
        UPDATE solutions
        SET status = 'paid'
        WHERE id = ${bestSolution.id}
      `;

      // mark problem as completed
      await tx`
        UPDATE problems
        SET status = 'completed'
        WHERE id = ${c.problem_id}
      `;
    });

    results.push({
      payment_id: c.payment_id,
      action: "auto_released_to_best_solution",
      freelancer: bestSolution.user_id,
      score: bestSolution.ai_score
    });

  } catch (err) {
    console.error("❌ Auto-release error:", err);
    results.push({
      payment_id: c.payment_id,
      action: "auto_release_failed",
      error: err.message
    });
  }

  continue;
}


      // 3️⃣ No accepted solution → REFUND case
      if (!c.razorpay_payment_id) {
        // No Razorpay record — local refund only
        await sql`BEGIN`;

        try {
          await sql`
            UPDATE payments
            SET status='refunded', refunded_at = NOW()
            WHERE id = ${c.payment_id}
          `;

          await sql`
            UPDATE problems
            SET status = 'closed_no_solution'
            WHERE id = ${c.problem_id}
          `;

          await sql`COMMIT`;
        } catch (err) {
          await sql`ROLLBACK`;
          throw err;
        }

        results.push({
          payment_id: c.payment_id,
          action: "local_refund_no_payment_id"
        });
        continue;
      }

      // Full Razorpay refund
      try {
        const refundResp = await razorpay.payments.refund(
          c.razorpay_payment_id,
          { amount: Math.round(Number(c.amount) * 100) } // paise
        );

        // Update DB after refund
        await sql`BEGIN`;

        try {
          await sql`
            UPDATE payments
            SET status='refunded', refunded_at = NOW()
            WHERE id = ${c.payment_id}
          `;

          await sql`
            UPDATE problems
            SET status = 'closed_no_solution'
            WHERE id = ${c.problem_id}
          `;

          await sql`COMMIT`;
        } catch (err) {
          await sql`ROLLBACK`;
          throw err;
        }

        results.push({
          payment_id: c.payment_id,
          action: "refunded",
          refund: refundResp
        });

      } catch (err) {
        console.error("❌ Refund error for payment", c.payment_id, err);
        results.push({
          payment_id: c.payment_id,
          action: "refund_failed",
          error: err.message || err
        });
      }
    }

    // Response depending on invocation mode
    if (invokedByHttp) {
      return res.json({ success: true, processed: results });
    } else {
      return results;
    }

  } catch (err) {
    console.error("❌ processExpiredEscrows error:", err);
    if (invokedByHttp) return res.status(500).json({ error: err.message });
    throw err;
  }
};
