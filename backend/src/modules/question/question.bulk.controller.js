import Question from "../../models/Question.js";
import { generateQuestionHash } from "./question.hash.service.js";

export async function bulkInsertQuestions(req, res) {
  try {
    const { subjectId, questions } = req.body;

    if (!subjectId || !questions || !Array.isArray(questions)) {
      return res.status(400).json({
        success: false,
        message: "Invalid payload. subjectId and questions array required."
      });
    }

    let insertedCount = 0;

    for (const q of questions) {

      // Generate unique hash
      const hash = generateQuestionHash(q);

      // Skip duplicates
      const exists = await Question.findOne({ questionHash: hash });
      if (exists) continue;

      const formattedOptions = q.options.map((text, index) => ({
        text,
        isCorrect: index === q.correctOption
      }));

      await Question.create({
        subject: subjectId,
        questionText: q.questionText,
        options: formattedOptions,
        explanation: q.explanation,
        difficulty: q.difficulty,
        conceptTags: q.conceptTags,
        questionType: "previous_year", // since you're building static pool
        aiModelVersion: "manual_entry",
        promptVersion: "manual_entry",
        validationStatus: "approved",
        validationScore: 1,
        questionHash: hash
      });

      insertedCount++;
    }

    return res.json({
      success: true,
      inserted: insertedCount
    });

  } catch (error) {
    console.error("Bulk Insert Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
}
