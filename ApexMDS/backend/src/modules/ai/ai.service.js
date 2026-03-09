export const generateQuestionsFromAI = async ({ subjects }) => {
  /**
   * subjects example:
   * [
   *  { name: "Oral Pathology", count: 60 },
   *  { name: "Prosthodontics", count: 60 },
   *  ...
   * ]
   */

  // PSEUDO-CODE (provider independent)
  return [
    {
      text: "Which nerve supplies the tongue?",
      options: ["A", "B", "C", "D"],
      correctOptionIndex: 2,
      subject: "Oral Anatomy"
    }
    // ... 240 total
  ];
};
