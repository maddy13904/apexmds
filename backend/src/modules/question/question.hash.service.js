import crypto from "crypto"

export function generateQuestionHash(question) {
  const normalized =
    question.questionText.toLowerCase().trim() +
    question.options.join("").toLowerCase().trim()

  return crypto.createHash("sha256").update(normalized).digest("hex")
}
