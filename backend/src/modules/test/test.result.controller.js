import TestSession from "../../models/TestSession.js";
import QuestionAttempt from "../../models/QuestionAttempt.js";

export const getTestResult = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const userId = req.user._id;

    // 1️⃣ Validate session ownership
    const session = await TestSession.findOne({
      _id: sessionId,
      user: userId
    });

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    // Optional: Only allow result after completion
    if (!session.completed) {
  session.completed = true;
  session.endTime = new Date();
  await session.save();
}

    // 2️⃣ Fetch attempts
    const attempts = await QuestionAttempt.find({
      testSession: sessionId
    }).populate("subject", "name");

    const total = session.totalQuestions;
    const attempted = attempts.length;

    const correct = attempts.filter(a => a.isCorrect).length;
    const wrong = attempted - correct;
    const unattempted = total - attempted;

    const accuracy =
      total > 0
        ? Number(((correct / total) * 100).toFixed(2))
        : 0;

    // 3️⃣ Time calculation
    let timeTakenMinutes = 0;

    if (session.startTime && session.endTime) {
      timeTakenMinutes = Number(
        ((session.endTime - session.startTime) / (1000 * 60)).toFixed(2)
      );
    }

    const avgTimePerQuestion =
      attempted > 0
        ? Number((timeTakenMinutes / attempted).toFixed(2))
        : 0;

    // 4️⃣ Subject-wise breakdown
    const subjectMap = {};

    attempts.forEach(attempt => {
      const subjectName = attempt.subject?.name || "Unknown";

      if (!subjectMap[subjectName]) {
        subjectMap[subjectName] = {
          total: 0,
          correct: 0,
          wrong: 0
        };
      }

      subjectMap[subjectName].total += 1;

      if (attempt.isCorrect) {
        subjectMap[subjectName].correct += 1;
      } else {
        subjectMap[subjectName].wrong += 1;
      }
    });

    const subjectStats = Object.keys(subjectMap).map(name => {
      const data = subjectMap[name];

      const subjectAccuracy =
        data.total > 0
          ? Number(((data.correct / data.total) * 100).toFixed(2))
          : 0;

      return {
        subject: name,
        total: data.total,
        correct: data.correct,
        wrong: data.wrong,
        accuracy: subjectAccuracy
      };
    });

    // 5️⃣ Weak & Strong detection
    const weakSubjects = subjectStats.filter(s => s.accuracy < 50);
    const strongSubjects = subjectStats.filter(s => s.accuracy >= 75);

    // 6️⃣ Performance Label
    let performanceLevel = "Average";

    if (accuracy >= 75) performanceLevel = "Strong";
    else if (accuracy < 50) performanceLevel = "Needs Improvement";

    // 7️⃣ Final Response
    res.json({
      totalQuestions: total,
      attempted,
      unattempted,
      correct,
      wrong,
      accuracy,
      performanceLevel,
      timeTakenMinutes,
      avgTimePerQuestion,
      subjectStats,
      weakSubjects,
      strongSubjects
    });

  } catch (error) {
    console.error("RESULT ERROR:", error);
    res.status(500).json({ message: "Failed to fetch result" });
  }
};
