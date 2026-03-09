import Question from "../../models/Question.js";
import Subject from "../../models/Subject.js";
import ReplenishRotation from "../../models/ReplenishRotation.js"
import { generateBatchQuestions } from "./question.batch.generator.js";

const DAILY_BATCH_SIZE = 3;

export async function monitorQuestionPool() {
  try {
    console.log("🔁 Starting Rotational Question Growth...");

    const subjects = await Subject.find({}, "_id name");

    if (!subjects.length) {
      console.log("⚠ No subjects found.");
      return;
    }

    let rotation = await ReplenishRotation.findOne();

    if (!rotation) {
      rotation = await ReplenishRotation.create({ lastIndex: -1 });
    }

    const nextIndex = (rotation.lastIndex + 1) % subjects.length;

    const subject = subjects[nextIndex];

    await generateBatchQuestions({
      subjectId: subject._id,
      subjectName: subject.name,
      count: DAILY_BATCH_SIZE
    });

    rotation.lastIndex = nextIndex;
    await rotation.save();

    console.log(`✅ Generated ${DAILY_BATCH_SIZE} questions for ${subject.name}`);
    console.log("🎯 Rotation index updated:", nextIndex);

  } catch (error) {
    console.error("❌ Rotational Growth Error:", error.message);
  }
}
