export function getNextDifficulty(conceptStats) {
  if (!conceptStats) return "medium";

  if (conceptStats.accuracy < 40) return "easy";
  if (conceptStats.accuracy < 70) return "medium";
  return "hard";
}
