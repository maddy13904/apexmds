import express from "express";
import { getAllPapers } from "./paper.controller.js";

const router = express.Router();

router.get("/papers", getAllPapers);

export default router;