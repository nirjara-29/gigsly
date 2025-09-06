import express from "express";
import upload from "../middleware/upload.js";
import {
  createProblem,
  getProblems,
  getProblemById,
} from "../controllers/problemController.js";

const router = express.Router();

router.get("/", getProblems);
router.get("/:id", getProblemById);
router.post("/", upload.array("attachment"), createProblem);

export default router;
