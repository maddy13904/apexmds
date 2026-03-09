import express from "express";
import { startTest } from "./test.controller.js";
import authMiddleware from "../../middlewares/auth.middleware.js";
import { submitAnswer } from "./test.controller.js";
import { getTestResult } from "./test.result.controller.js"
import { getUserTestHistory} from "./test.history.controller.js"

const router = express.Router();

router.post("/start", authMiddleware, startTest);
router.post("/submit-answer", authMiddleware, submitAnswer);
router.get("/result/:sessionId", authMiddleware, getTestResult);
router.get("/history", authMiddleware, getUserTestHistory);

export default router;
