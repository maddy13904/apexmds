import express from "express";
import {
  getNotificationSettings,
  updateNotificationSettings,
  savePushToken
} from "./notification.controller.js";

import authMiddleware from "../../middlewares/auth.middleware.js";

const router = express.Router();

/* ===============================
   GET USER NOTIFICATION SETTINGS
================================ */

router.get(
  "/notification-settings",
  authMiddleware,
  getNotificationSettings
);

/* ===============================
   UPDATE NOTIFICATION SETTINGS
================================ */

router.put(
  "/notification-settings",
  authMiddleware,
  updateNotificationSettings
);

router.post(
  "/push-token",
  authMiddleware,
  savePushToken
);

export default router;