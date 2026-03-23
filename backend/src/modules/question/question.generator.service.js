import { buildQuestionPrompt } from "../ai/prompt.builder.js";
import { generateWithGemini } from "../ai/gemini.service.js";
import { validateGeneratedQuestion } from "../ai/ai.validation.service.js";
import { generateQuestionHash } from "./question.hash.service.js";
import Question from "../../models/Question.js";

const MAX_RETRIES = 2;

export async function createAIQuestion({
  subjectId,
  subjectName,
  difficulty,
  concept,
  questionType
}) {

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {

    try {
      const prompt = buildQuestionPrompt({
        subject: subjectName,
        difficulty,
        concept
      });

      const rawText = await generateWithGemini(prompt, "question");

      // Parse JSON safely
      let parsed;
      try {
        parsed = JSON.parse(rawText);
      } catch (err) {
        console.log("JSON parse failed. Retrying...");
        continue;
      }

      const isValid = validateGeneratedQuestion(parsed);
      if (!isValid) {
        console.log("Validation failed. Retrying...");
        continue;
      }

      const hash = generateQuestionHash(parsed);

      const exists = await Question.findOne({ questionHash: hash });
      if (exists) {
        console.log("Duplicate detected. Retrying...");
        continue;
      }

      // Transform to DB structure
      const optionsFormatted = parsed.options.map((text, index) => ({
        text,
        isCorrect: index === parsed.correctOption
      }));

      const saved = await Question.create({
        subject: subjectId,
        questionText: parsed.questionText,
        options: optionsFormatted,
        explanation: parsed.explanation,
        difficulty: parsed.difficulty,
        conceptTags: parsed.conceptTags,
        questionType,
        aiModelVersion: "gemini-2.5-flash",
        promptVersion: "v1_gemini",
        validationStatus: "approved",
        validationScore: 1.0,
        questionHash: hash
      });

      return saved;

    } catch (error) {
      console.error("Attempt failed:", attempt);
    }
  }

  throw new Error("Failed to generate valid question after retries.");
}
