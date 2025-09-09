import express from "express";
import upload from "../middleware/upload.js";
import {
  createProblem,
  getProblems,
  getProblemById,
  getMyProblems,
} from "../controllers/problemController.js";
import { clerkAuth } from "../middleware/clerkAuth.js";
import { getProblemSolutions } from "../controllers/solutionController.js";
import { requireAuth } from "@clerk/express";
import { ensureUserExists } from "../middleware/ensureUserExists.js";

const router = express.Router();

router.get("/", getProblems);
router.get("/mine", clerkAuth, ensureUserExists, getMyProblems)
router.get("/:id", getProblemById);
router.post("/",clerkAuth, ensureUserExists, upload.array("attachment"), createProblem);
router.get('/:problemId/solutions', clerkAuth, ensureUserExists, getProblemSolutions);

export default router;
