import UserConceptPerformance from "./userConceptPerformance.model.js";

export async function updateConceptStats({
  userId,
  subjectId,
  conceptTags,
  isCorrect,
  difficulty
}) {
  for (const concept of conceptTags) {

    const update = {
      $inc: {
        totalAttempts: 1,
        correctAttempts: isCorrect ? 1 : 0,
        [`${difficulty}Attempts`]: 1
      },
      $set: {
        lastAttemptAt: new Date()
      }
    };

    const doc = await UserConceptPerformance.findOneAndUpdate(
      {
        user: userId,
        subject: subjectId,
        concept
      },
      update,
      {
        new: true,
        upsert: true
      }
    );

    // Recalculate accuracy
    doc.accuracy =
      doc.totalAttempts > 0
        ? (doc.correctAttempts / doc.totalAttempts) * 100
        : 0;

    await doc.save();
  }
}
