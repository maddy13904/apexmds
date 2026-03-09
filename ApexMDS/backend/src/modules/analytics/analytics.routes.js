import express from "express";
import { getGlobalAnalytics, getStudyPlan } from "./analytics.controller.js";
import authMiddleware from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/global", authMiddleware, getGlobalAnalytics);
router.get("/study-plan", authMiddleware, getStudyPlan);

export default router;
