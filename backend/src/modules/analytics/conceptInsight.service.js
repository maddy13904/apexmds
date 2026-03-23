import UserConceptPerformance from "./userConceptPerformance.model.js";

export async function getWeakConcepts(userId, subjectName) {
  const concepts = await UserConceptPerformance.find({
    user: userId,
    subjectName
  }).sort({ accuracy: 1 }).limit(5);

  return concepts.map(c => ({
    concept: c.conceptTag,
    accuracy: Number(((c.correctCount / c.totalAttempts) * 100).toFixed(2))
  }));
}
