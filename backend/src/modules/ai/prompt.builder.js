export function buildQuestionPrompt({ subject, difficulty, concept }) {
  return `
You are a NEET MDS expert question setter.

Generate ONE high-quality NEET MDS single best answer question.

STRICT RULES:
- Clinical depth
- Dental PG level
- No ambiguity
- No "all of the above"
- Exactly 4 options
- Exactly one correct option
- Detailed medical explanation
- No markdown
- No extra commentary

Return ONLY valid JSON.

Format:
{
  "questionText": "string",
  "options": ["string", "string", "string", "string"],
  "correctOption": 0,
  "explanation": "string",
  "subject": "${subject}",
  "difficulty": "${difficulty}",
  "conceptTags": ["string", "string"]
}
`;
}
