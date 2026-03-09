import TestSession from "../../models/TestSession.js";
import QuestionAttempt from "../../models/QuestionAttempt.js";

export async function computeUserPerformance(userId) {

  const sessions = await TestSession.find({ user: userId });
  const attempts = await QuestionAttempt.find({ user: userId })
    .populate("subject", "name");

  const totalQuestionsAttempted = attempts.length;
  const totalCorrect = attempts.filter(a => a.isCorrect).length;
  const totalWrong = totalQuestionsAttempted - totalCorrect;

  const overallAccuracy =
    totalQuestionsAttempted > 0
      ? Number(((totalCorrect / totalQuestionsAttempted) * 100).toFixed(2))
      : 0;

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
    if (attempt.isCorrect) subjectMap[subjectName].correct += 1;
    else subjectMap[subjectName].wrong += 1;
  });

  const subjectStats = Object.keys(subjectMap).map(name => {
    const data = subjectMap[name];

    const accuracy =
      data.total > 0
        ? Number(((data.correct / data.total) * 100).toFixed(2))
        : 0;

    return {
      subject: name,
      total: data.total,
      correct: data.correct,
      wrong: data.wrong,
      accuracy
    };
  });

  subjectStats.sort((a, b) => a.accuracy - b.accuracy);

  const weakSubjects = subjectStats.filter(s => s.accuracy < 50);
  const strongSubjects = subjectStats.filter(s => s.accuracy >= 75);

  let performanceLevel = "Average";
  if (overallAccuracy >= 75) performanceLevel = "Strong";
  else if (overallAccuracy < 50) performanceLevel = "Needs Improvement";

  return {
    totalTests: sessions.length,
    totalQuestionsAttempted,
    totalCorrect,
    totalWrong,
    overallAccuracy,
    performanceLevel,
    subjectStats,
    weakSubjects,
    strongSubjects
  };
}
