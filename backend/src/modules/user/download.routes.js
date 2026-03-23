import express from "express";

import {
  saveDownload,
  getUserDownloads,
  deleteDownload
} from "../user/download.controller.js";

import authMiddleware from "../../middlewares/auth.middleware.js"

const router = express.Router();


router.post("/", authMiddleware, saveDownload);

router.get("/", authMiddleware, getUserDownloads);

router.delete("/:contentId", authMiddleware, deleteDownload);


export default router;