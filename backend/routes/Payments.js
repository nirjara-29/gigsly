import express from "express";
import multer from "multer";
import { clerkAuth } from "../middleware/clerkAuth.js";
import { ensureUserExists } from "../middleware/ensureUserExists.js";
import { processExpiredEscrows } from "../controllers/expiryController.js";

import {
  createProblemEscrow,
  verifyProblemPayment,
  releasePayment        // ✅ IMPORTANT — you forgot to import this!
} from "../controllers/paymentController.js";

const router = express.Router();

// ========== MULTER ==========
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// ========== ROUTES ==========

// Post problem + upload attachments + start escrow
router.post(
  "/create-problem-escrow",
  clerkAuth,
  ensureUserExists,
  upload.array("files"),
  createProblemEscrow
);

// After Razorpay success
router.post(
  "/verify-problem-payment",
  clerkAuth,
  ensureUserExists,
  verifyProblemPayment
);

// RELEASE PAYMENT (owner → freelancer)
router.post(
  "/release/:problemId",
  clerkAuth,
  ensureUserExists,
  releasePayment
);

router.post("/process-expired-escrows", clerkAuth, ensureUserExists, processExpiredEscrows);
export default router;
