import express from "express";
import authMiddleware from "../../middlewares/auth.middleware.js";
import { getDashboardSummary } from "./dashboard.controller.js";

const router = express.Router();

router.get("/summary", authMiddleware, getDashboardSummary);

export default router;
