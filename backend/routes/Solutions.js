// backend/routes/solutions.js
import express from "express";
import upload from "../middleware/upload.js";
import { 
  createSolution, 
  getSolutionsByProblem, 
  getProblemSolutions, 
  getMySolutions 
} from "../controllers/solutionController.js";
import { clerkAuth } from "../middleware/clerkAuth.js";

const router = express.Router();

// Protect these with clerkAuth
router.get("/my", clerkAuth, getMySolutions);
router.get("/problem/:problemId/mysolutions", clerkAuth, getProblemSolutions);
router.post("/:problemId", clerkAuth, upload.array("files"), createSolution);

// Public route
router.get("/problem/:problemId/solutions", getSolutionsByProblem);

export default router;
