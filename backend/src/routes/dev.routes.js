import express from "express";
import { createAIQuestion } from "../modules/question/question.generator.service.js";
import Subject from "../models/Subject.js";
import { generateWithGemini } from "../modules/ai/gemini.service.js";
import { bulkInsertQuestions } from "../modules/question/question.bulk.controller.js";

const router = express.Router();

router.post("/bulk", bulkInsertQuestions);

router.get("/test-gemini", async (req, res) => {
  try {
    const result = await generateWithGemini("Say hello in JSON {\"message\":\"hello\"}");
    res.json({ result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/generate-one", async (req, res) => {
  try {
    // Pick any subject from DB
    const subject = await Subject.findOne();

    if (!subject) {
      return res.status(400).json({ message: "No subject found in DB" });
    }

    const question = await createAIQuestion({
      subjectId: subject._id,
      subjectName: subject.name,
      difficulty: "medium",
      concept: null,
      questionType: "dynamic"
    });

    res.json({
      success: true,
      question
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
