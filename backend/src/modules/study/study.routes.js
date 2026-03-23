import express from "express";
import authMiddleware from "../../middlewares/auth.middleware.js";
import {
  getYears,
  getPapersByYear,
  getPracticeQuestions,
  submitAnswer,
  getPracticeSummary
} from "./study.controller.js";

const router = express.Router();

router.get("/years", authMiddleware, getYears);
router.get("/papers/:yearId", authMiddleware, getPapersByYear);
router.get("/practice/:paperId", authMiddleware, getPracticeQuestions);
router.post("/submit-answer", authMiddleware, submitAnswer);
router.get("/summary/:paperId", authMiddleware, getPracticeSummary);

export default router;
