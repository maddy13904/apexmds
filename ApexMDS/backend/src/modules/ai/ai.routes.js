import express from "express";
import authMiddleware from "../../middlewares/auth.middleware.js";
import { generateTutorPlan, generateTutorChat } from "./ai.tutor.controller.js";

import {
  chatWithAI,
  generateQuestionPaper
} from "./ai.controller.js";

const router = express.Router();

router.post("/chat", authMiddleware, chatWithAI);
router.post("/generate-paper", authMiddleware, generateQuestionPaper);
router.post("/tutor/plan", authMiddleware, generateTutorPlan);
router.post("/tutor/chat", authMiddleware, generateTutorChat);

//router.post("/tutor/mcq", authMiddleware, generateTutorMCQs);

export default router;
