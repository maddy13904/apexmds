import Question from "../../models/Question.js";
import Subject from "../../models/Subject.js";
import QuestionPaper from "../../models/QuestionPaper.js";
import PreviousYear from "../../models/PreviousYear.js";
import { generateQuestionsFromAI } from "./ai.service.js";


export const chatWithAI = async (req, res) => {
  const { question } = req.body;

  // Later: store chat history
  const answer = "AI explanation will go here";

  res.json({ answer });
};


export const generateQuestionPaper = async (req, res) => {
  const { year, paperNumber, subjects } = req.body;

  // 1️⃣ Validate year & paper
  const yearDoc = await PreviousYear.findOne({ year });
  if (!yearDoc) {
    return res.status(400).json({ message: "Invalid year" });
  }

  const existingPaper = await QuestionPaper.findOne({
    year: yearDoc._id,
    paperNumber
  });

  if (existingPaper) {
    return res.status(400).json({ message: "Paper already exists" });
  }

  // 2️⃣ Ask AI for questions
  const aiQuestions = await generateQuestionsFromAI({ subjects });

  if (aiQuestions.length !== 240) {
    return res.status(400).json({ message: "AI did not return 240 questions" });
  }

  const questionIds = [];

  // 3️⃣ Validate & save questions
  for (const q of aiQuestions) {
    const subject = await Subject.findOne({ name: q.subject });
    if (!subject) continue;

    // Prevent duplicates globally
    const existing = await Question.findOne({ text: q.text });
    if (existing) continue;

    const saved = await Question.create({
      text: q.text,
      options: q.options,
      correctOptionIndex: q.correctOptionIndex,
      subject: subject._id
    });

    questionIds.push(saved._id);
  }

  if (questionIds.length !== 240) {
    return res.status(500).json({
      message: "Duplicate or invalid questions detected. Regenerate."
    });
  }

  // 4️⃣ Create paper
  const paper = await QuestionPaper.create({
    year: yearDoc._id,
    paperNumber,
    questions: questionIds
  });

  res.json({
    message: "Question paper generated successfully",
    paperId: paper._id
  });
};
