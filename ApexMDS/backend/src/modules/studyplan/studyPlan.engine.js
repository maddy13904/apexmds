import TestSession from "../../models/TestSession.js";
import UserConceptPerformance from "../../models/userConceptPerformance.model.js";
import { computeUserPerformance } from "../analytics/performance.engine.js";

export async function generateStudyPlan(userId) {
  try {

    const performance = await computeUserPerformance(userId);

    if (!performance.subjectStats.length) {
      return {
        message: "No performance data yet",
        todayFocus: null
      };
    }

    // 🔹 1️⃣ Weakest Subject
    const weakestSubject = performance.subjectStats[0];

    // 🔹 2️⃣ Fetch Weak Concepts inside that subject
    const conceptStats = await UserConceptPerformance.find({
      user: userId,
      subjectName: weakestSubject.subject
    });

    const conceptWithAccuracy = conceptStats
      .map(c => ({
        concept: c.conceptTag,
        accuracy:
          c.totalAttempts > 0
            ? Number(((c.correctCount / c.totalAttempts) * 100).toFixed(2))
            : 0,
        totalAttempts: c.totalAttempts
      }))
      .filter(c => c.totalAttempts >= 3) // avoid noise
      .sort((a, b) => a.accuracy - b.accuracy);

    const weakConcepts = conceptWithAccuracy.slice(0, 5);

    // 🔹 3️⃣ Plan Intensity Logic
    let planType = "revision_mode";
    let recommendedQuestions = 20;
    let recommendedTimeMinutes = 30;

    if (weakestSubject.accuracy < 40) {
      planType = "concept_rebuild";
      recommendedQuestions = 35;
      recommendedTimeMinutes = 60;
    }
    else if (weakestSubject.accuracy < 60) {
      planType = "reinforcement";
      recommendedQuestions = 30;
      recommendedTimeMinutes = 45;
    }
    else if (weakestSubject.accuracy < 75) {
      planType = "speed_training";
      recommendedQuestions = 25;
      recommendedTimeMinutes = 35;
    }

    // 🔹 4️⃣ Generate Structured AI Tutor Prompt
    const aiPrompt = `
I am preparing for NEET MDS.

My weakest subject is ${weakestSubject.subject}.
Overall subject accuracy: ${weakestSubject.accuracy}%.

Weakest concepts:
${weakConcepts.map(c => `- ${c.concept} (${c.accuracy}%)`).join("\n")}

Create:
1. Concept rebuilding strategy
2. Common exam traps
3. 10 rapid revision bullets
4. Memory retention techniques
`.trim();

    return {
      overallAccuracy: performance.overallAccuracy,
      todayFocusSubject: weakestSubject.subject,
      subjectAccuracy: weakestSubject.accuracy,
      weakConcepts,
      planType,
      recommendedQuestions,
      recommendedTimeMinutes,
      aiPrompt
    };

  } catch (error) {
    console.error("STUDY PLAN ENGINE ERROR:", error);
    throw error;
  }
}
