import TestSession from "../../models/TestSession.js";
import QuestionAttempt from "../../models/QuestionAttempt.js";

export const getUserTestHistory = async (req, res) => {
  try {
    const userId = req.user._id;

    // Get all sessions of user (latest first)
    const sessions = await TestSession.find({ user: userId })
      .sort({ createdAt: -1 });

    const formattedHistory = [];

    for (const session of sessions) {

      const attempts = await QuestionAttempt.find({
        testSession: session._id
      });

      const correct = attempts.filter(a => a.isCorrect).length;
      const attempted = attempts.length;
      const total = session.totalQuestions;

      const accuracy =
        total > 0 ? Number(((correct / total) * 100).toFixed(2)) : 0;

      formattedHistory.push({
        sessionId: session._id,
        sessionType: session.sessionType,
        totalQuestions: total,
        attempted,
        score: session.score,
        accuracy,
        completed: session.completed,
        timeLimitMinutes: session.timeLimitMinutes,
        createdAt: session.createdAt
      });
    }

    res.json({
      totalTests: formattedHistory.length,
      history: formattedHistory
    });

  } catch (error) {
    console.error("TEST HISTORY ERROR:", error);
    res.status(500).json({ message: "Failed to fetch test history" });
  }
};
