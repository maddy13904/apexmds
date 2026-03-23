import { GoogleGenAI } from "@google/genai";

const genAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

// =============================
// 🔹 QUESTION GENERATION MODEL
// =============================
export async function generateWithGemini(prompt) {
  try {
    const response = await genAI.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt
    });

    return response.text;

  } catch (error) {
    console.error("Gemini Error:", error.message);
    throw new Error(error.message);
  }
}

// =============================
// 🔹 TUTOR MODEL (Use Different Model)
// =============================
export const generateTutorPlan = async (req, res) => {
  try {
    console.log("BODY RECEIVED:", req.body);

    if (!req.body || !req.body.prompt) {
      return res.status(400).json({
        message: "Prompt is required"
      });
    }

    const { prompt } = req.body;

    const aiResponse = await generateWithGeminiTutor(prompt);

    return res.json({
      success: true,
      plan: aiResponse
    });

  } catch (error) {
    console.error("TUTOR PLAN ERROR:", error);
    return res.status(500).json({
      message: "Failed to generate tutor response"
    });
  }
};
