import express from "express";
import { getAllEbooks } from "./ebooks.controller.js";

const router = express.Router();

router.get("/ebooks", getAllEbooks);

export default router;