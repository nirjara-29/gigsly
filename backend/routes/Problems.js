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

const router = express.Router();

router.get("/", getProblems);
router.get("/mine", clerkAuth, getMyProblems)
router.get("/:id", getProblemById);
router.post("/", upload.array("attachment"), createProblem);
router.get('/:problemId/solutions', clerkAuth,getProblemSolutions);

export default router;
