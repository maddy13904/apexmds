export function validateGeneratedQuestion(q) {
  if (!q.questionText) return false
  if (!Array.isArray(q.options) || q.options.length !== 4) return false
  if (q.correctOption < 0 || q.correctOption > 3) return false
  if (!q.explanation) return false
  if (!q.subject) return false
  if (!q.difficulty) return false
  if (!Array.isArray(q.conceptTags)) return false

  return true
}
