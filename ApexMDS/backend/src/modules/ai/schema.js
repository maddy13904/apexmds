export const questionSchema = {
  name: "neet_mds_question",
  schema: {
    type: "object",
    additionalProperties: false,   // 🔥 REQUIRED
    required: [
      "questionText",
      "options",
      "correctOption",
      "explanation",
      "subject",
      "difficulty",
      "conceptTags"
    ],
    properties: {
      questionText: {
        type: "string"
      },
      options: {
        type: "array",
        minItems: 4,
        maxItems: 4,
        items: {
          type: "string"
        }
      },
      correctOption: {
        type: "number"
      },
      explanation: {
        type: "string"
      },
      subject: {
        type: "string"
      },
      difficulty: {
        type: "string",
        enum: ["easy", "medium", "hard"]
      },
      conceptTags: {
        type: "array",
        items: {
          type: "string"
        }
      }
    }
  }
};
