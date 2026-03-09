import { getWeakConcepts } from "./conceptInsight.service.js";
import { getNextDifficulty } from "./difficulty.engine.js";
import { createAIQuestion } from "../question/question.generator.service.js";
import userConceptPerformanceModel from "./userConceptPerformance.model.js";
import Subject from "../../models/Subject.js";
import Question from "../../models/Question.js";

export const getAdaptiveQuestionsForDailyQuiz = async (
  userId,
  totalQuestions
) => {

  const subjects = await Subject.find();

  // 1️⃣ Get user overall concept accuracy
  const concepts = await userConceptPerformanceModel.find({ user: userId });

  let overallAccuracy = 60;

  if (concepts.length) {
    overallAccuracy =
      concepts.reduce((sum, c) => sum + c.accuracy, 0) /
      concepts.length;
  }

  // 2️⃣ Decide difficulty distribution
  let difficultyMix;

  if (overallAccuracy < 40) {
    difficultyMix = { easy: 0.6, medium: 0.3, hard: 0.1 };
  } else if (overallAccuracy < 70) {
    difficultyMix = { easy: 0.3, medium: 0.5, hard: 0.2 };
  } else {
    difficultyMix = { easy: 0.1, medium: 0.4, hard: 0.5 };
  }

  const easyCount = Math.floor(totalQuestions * difficultyMix.easy);
  const mediumCount = Math.floor(totalQuestions * difficultyMix.medium);
  const hardCount =
    totalQuestions - easyCount - mediumCount;

  // 3️⃣ Weak concepts across all subjects
  const weakConcepts = concepts
    .filter(c => c.accuracy < 60)
    .map(c => c.conceptTag);

  let questions = [];

  // 4️⃣ Fetch easy
  const easyQ = await Question.find({
    difficulty: "easy",
    conceptTags: { $in: weakConcepts },
    validationStatus: "approved"
  }).limit(easyCount);

  questions.push(...easyQ);

  // 5️⃣ Medium
  const mediumQ = await Question.find({
    difficulty: "medium",
    conceptTags: { $in: weakConcepts },
    validationStatus: "approved"
  }).limit(mediumCount);

  questions.push(...mediumQ);

  // 6️⃣ Hard
  const hardQ = await Question.find({
    difficulty: "hard",
    conceptTags: { $in: weakConcepts },
    validationStatus: "approved"
  }).limit(hardCount);

  questions.push(...hardQ);

  // 7️⃣ Fill remaining randomly if needed
  if (questions.length < totalQuestions) {

    const remaining = totalQuestions - questions.length;

    const randomFill = await Question.aggregate([
      { $match: { validationStatus: "approved" } },
      { $sample: { size: remaining } }
    ]);

    questions.push(...randomFill);
  }

  // Shuffle before returning
  return questions.sort(() => Math.random() - 0.5);
};


export async function generateAdaptiveQuestion(userId) {

  // Step 1: Get weakest concept
  const weakConcepts = await getWeakConcepts(userId, 1);

  // If no weak concepts found → fallback to normal generation
  if (!weakConcepts.length) {

    return await createAIQuestion({
      subjectName: "Oral Pathology",  // temporary fallback
      difficulty: "medium",
      concept: null,
      questionType: "dynamic"
    });
  }

  const weakest = weakConcepts[0];

  // Step 2: Get difficulty based on accuracy
  const difficulty = getNextDifficulty(weakest);

  // Step 3: Get subject name (since we only stored subjectId)
  const subjectDoc = await Subject.findById(weakest.subject);

  // Step 4: Generate targeted question
  return await createAIQuestion({
    subjectId: weakest.subject,
    subjectName: subjectDoc.name,
    difficulty,
    concept: weakest.concept,
    questionType: "dynamic"
  });
}
