import TestSession from "../../models/TestSession.js";
import QuestionAttempt from "../../models/QuestionAttempt.js";

export const getDashboardSummary = async (req, res) => {
  try {
    const userId = req.user._id;

    // 1️⃣ All completed tests
    const sessions = await TestSession.find({
      user: userId,
      completed: true
    }).sort({ createdAt: -1 });

    const totalTests = sessions.length;

    if (totalTests === 0) {
      return res.json({
        totalTests: 0,
        totalQuestionsAttempted: 0,
        overallAccuracy: 0,
        strongestSubject: null,
        weakestSubject: null,
        lastTest: null
      });
    }

    // 2️⃣ All attempts
    const attempts = await QuestionAttempt.find({
      user: userId
    }).populate("subject", "name");

    const totalQuestionsAttempted = attempts.length;
    const totalCorrect = attempts.filter(a => a.isCorrect).length;

    const overallAccuracy =
      totalQuestionsAttempted > 0
        ? Number(((totalCorrect / totalQuestionsAttempted) * 100).toFixed(2))
        : 0;

    // 3️⃣ Subject performance map
    const subjectMap = {};

    attempts.forEach(attempt => {
      const subjectName = attempt.subject?.name || "Unknown";

      if (!subjectMap[subjectName]) {
        subjectMap[subjectName] = {
          total: 0,
          correct: 0
        };
      }

      subjectMap[subjectName].total += 1;

      if (attempt.isCorrect) {
        subjectMap[subjectName].correct += 1;
      }
    });

    const subjectStats = Object.keys(subjectMap).map(name => {
      const data = subjectMap[name];
      const accuracy =
        data.total > 0
          ? (data.correct / data.total) * 100
          : 0;

      return {
        subject: name,
        accuracy
      };
    });

    let strongestSubject = null;
    let weakestSubject = null;

    if (subjectStats.length > 0) {
      strongestSubject = subjectStats.reduce((prev, current) =>
        current.accuracy > prev.accuracy ? current : prev
      ).subject;

      weakestSubject = subjectStats.reduce((prev, current) =>
        current.accuracy < prev.accuracy ? current : prev
      ).subject;
    }

    // 4️⃣ Last test
    const lastSession = sessions[0];

    const lastTest = {
      type: lastSession.sessionType,
      score: lastSession.score,
      total: lastSession.totalQuestions,
      accuracy:
        lastSession.totalQuestions > 0
          ? Number(
              ((lastSession.score / lastSession.totalQuestions) * 100).toFixed(2)
            )
          : 0,
      date: lastSession.createdAt
    };

    res.json({
      totalTests,
      totalQuestionsAttempted,
      overallAccuracy,
      strongestSubject,
      weakestSubject,
      lastTest
    });

  } catch (error) {
    console.error("DASHBOARD SUMMARY ERROR:", error);
    res.status(500).json({ message: "Failed to fetch dashboard summary" });
  }
};
