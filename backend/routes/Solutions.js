// routes/solutions.js
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
router.get("/my",clerkAuth, getMySolutions);
router.get("/problem/:problemId/mysolutions", clerkAuth, getProblemSolutions);
router.post("/:problemId", upload.array("files"), createSolution);
router.get("/:problemId", getSolutionsByProblem);

export default router;
