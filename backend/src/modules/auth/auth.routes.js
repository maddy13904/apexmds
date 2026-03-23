import express from "express";
import {
  registerUser,
  verifyEmailOtp,
  loginUser,
  forgotPassword,
  verifyResetOtp,
  resetPassword,
  getLoginHistory
} from "./auth.controller.js";
import authMiddleware from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/verify-email", verifyEmailOtp);
router.post("/login", loginUser);
router.post("/forgot-password", forgotPassword);
router.post("/verify-reset-otp", verifyResetOtp);
router.post("/reset-password", resetPassword);
router.get("/login-history", authMiddleware, getLoginHistory);

export default router;
