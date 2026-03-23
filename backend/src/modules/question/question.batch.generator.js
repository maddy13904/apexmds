import { createAIQuestion } from "./question.generator.service.js";

const MAX_RETRIES_PER_QUESTION = 2;

export async function generateBatchQuestions({
  subjectId,
  subjectName,
  count
}) {
  let generated = 0;

  console.log(`🚀 Generating ${count} questions for ${subjectName}`);

  for (let i = 0; i < count; i++) {
    let retries = 0;
    let success = false;

    while (retries < MAX_RETRIES_PER_QUESTION && !success) {
      try {
        await createAIQuestion({
          subjectId,
          subjectName,
          difficulty: pickDifficulty(),
          concept: null, // later: concept-based replenishment
          questionType: "dynamic"
        });

        generated++;
        success = true;
        await new Promise(resolve => setTimeout(resolve, 1200));


      } catch (error) {
        retries++;
        console.log(
          `Retry ${retries}/${MAX_RETRIES_PER_QUESTION} for ${subjectName}`
        );
      }
    }

    if (!success) {
      console.log(
        `❌ Failed to generate question after ${MAX_RETRIES_PER_QUESTION} retries`
      );
    }
  }

  console.log(
    `✅ Batch Complete → ${generated}/${count} created for ${subjectName}\n`
  );
}


// Balanced difficulty distribution
function pickDifficulty() {
  const rand = Math.random();

  if (rand < 0.4) return "easy";
  if (rand < 0.75) return "medium";
  return "hard";
}
