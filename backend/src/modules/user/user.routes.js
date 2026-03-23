import express from "express";
import authMiddleware from "../../middlewares/auth.middleware.js";
import {
  getMyProfile,
  updateMyProfile,
  changePassword,
  deleteAccount
} from "./user.controller.js";

const router = express.Router();

router.get("/me", authMiddleware, getMyProfile);
router.put("/me", authMiddleware, updateMyProfile);
router.put("/change-password", authMiddleware, changePassword);
router.delete("/delete-account", authMiddleware, deleteAccount);

export default router;
