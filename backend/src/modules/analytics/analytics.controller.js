import TestSession from "../../models/TestSession.js";
import QuestionAttempt from "../../models/QuestionAttempt.js";
import UserConceptPerformance from "./userConceptPerformance.model.js";
import { computeUserPerformance } from "./performance.engine.js";
import userStudyPlan from "../../models/UserStudyPlan.js";

/*
==================================================
🔹 INTERNAL HELPER — GET WEAK CONCEPTS
==================================================
*/
async function getWeakConcepts(userId, subjectName) {
  const concepts = await UserConceptPerformance.find({
    user: userId,
    subjectName
  });

  return concepts
    .map(c => ({
      concept: c.conceptTag,
      accuracy:
        c.totalAttempts > 0
          ? Number(((c.correctCount / c.totalAttempts) * 100).toFixed(2))
          : 0,
      totalAttempts: c.totalAttempts
    }))
    .filter(c => c.totalAttempts >= 3) // avoid noise
    .sort((a, b) => a.accuracy - b.accuracy)
    .slice(0, 5);
}

/*
==================================================
🔹 STUDY PLAN (Concept-Aware)
==================================================
*/
export const getStudyPlan = async (req, res) => {

  try {

    const userId = req.user._id;

    // 🔥 1️⃣ Check if plan already exists today
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const existingPlan = await userStudyPlan.findOne({
      user: userId,
      generatedAt: { $gte: startOfToday }
    });

    if (existingPlan) {
      return res.json(existingPlan);
    }

    // 🔥 2️⃣ Compute fresh performance
    const data = await computeUserPerformance(userId);

    if (!data.subjectStats.length) {
      return res.json({
        message: "No performance data yet",
        todayFocus: null
      });
    }

    const weakest = data.subjectStats[0];

    const weakConcepts = await getWeakConcepts(
      userId,
      weakest.subject
    );

    // 🔥 3️⃣ Plan Type Logic
    let planType = "revision_mode";
    let recommendedQuestions = 20;
    let recommendedTimeMinutes = 30;

    if (weakest.accuracy < 40) {
      planType = "concept_rebuild";
      recommendedQuestions = 35;
      recommendedTimeMinutes = 60;
    }
    else if (weakest.accuracy < 60) {
      planType = "reinforcement";
      recommendedQuestions = 30;
      recommendedTimeMinutes = 45;
    }
    else if (weakest.accuracy < 75) {
      planType = "speed_training";
      recommendedQuestions = 25;
      recommendedTimeMinutes = 35;
    }

    // 🔥 4️⃣ Build AI Prompt
    const aiPrompt = `
I am preparing for NEET MDS.

My weakest subject is ${weakest.subject}.
My accuracy is ${weakest.accuracy}%.
My weak concepts are:
${weakConcepts.map(c => `- ${c.concept} (${c.accuracy}%)`).join("\n")}

Create a structured improvement plan including:
1. Core concepts to revise
2. Common mistakes
3. High-yield exam traps
4. 10 rapid revision bullets
5. 5 MCQ traps
    `.trim();

    // 🔥 5️⃣ Store Plan
    const newPlan = await userStudyPlan.create({
      user: userId,
      focusSubject: weakest.subject,
      focusAccuracy: weakest.accuracy,
      weakConcepts: weakest.conceptTag,
      planType,
      recommendedQuestions,
      recommendedTimeMinutes,
      aiPrompt
    });

    return res.json(newPlan);

  } catch (error) {
    console.error("STUDY PLAN ERROR:", error);
    res.status(500).json({ message: "Failed to generate study plan" });
  }
};

/*
==================================================
🔹 GLOBAL ANALYTICS
==================================================
*/
export const getGlobalAnalytics = async (req, res) => {
  try {

    const userId = req.user._id;

    const data = await computeUserPerformance(userId);

    const sessions = await TestSession.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(5);

    const recentTests = sessions.map(session => ({
      sessionId: session._id,
      type: session.sessionType,
      totalQuestions: session.totalQuestions,
      score: session.score,
      accuracy:
        session.totalQuestions > 0
          ? Number(((session.score / session.totalQuestions) * 100).toFixed(2))
          : 0,
      completed: session.completed,
      createdAt: session.createdAt
    }));

    res.json({
      overview: {
        totalTests: data.totalTests,
        totalQuestionsAttempted: data.totalQuestionsAttempted,
        totalCorrect: data.totalCorrect,
        totalWrong: data.totalWrong,
        overallAccuracy: data.overallAccuracy,
        performanceLevel: data.performanceLevel
      },
      subjectStats: data.subjectStats,
      weakSubjects: data.weakSubjects,
      strongSubjects: data.strongSubjects,
      recentTests
    });

  } catch (error) {
    console.error("GLOBAL ANALYTICS ERROR:", error);
    res.status(500).json({ message: "Failed to fetch analytics" });
  }
};
